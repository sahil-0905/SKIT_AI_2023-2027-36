from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any
import logging

from code_analysis.metrics import (
    count_lines,
    count_functions,
    count_loops,
    count_conditions,
)
from code_analysis.complexity import get_complexity
from code_analysis.validate import validate_code
from code_analysis.quality import analyze_code_quality
from behavioural.monitor import calculate_risk
from behavioural.event_recorder import record_event
from behavioural.event_processor import process_events

# --------------------------------
# Logging Configuration
# --------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# --------------------------------
# FastAPI App
# --------------------------------

app = FastAPI(
    title="AI Interview Coding Platform API",
    description="Code Analysis and Behaviour Monitoring Service",
    version="1.0.0",
)

# --------------------------------
# Request Models
# --------------------------------

class CodeRequest(BaseModel):
    code: str = Field(..., min_length=1)


class BehaviourRequest(BaseModel):
    tab_switches: int = Field(default=0, ge=0)
    copy_paste_count: int = Field(default=0, ge=0)
    idle_time: int = Field(default=0, ge=0)

class EventRequest(BaseModel):
    session_id: str = Field(..., min_length=1)
    event_type: str
    duration_seconds: int = Field(default=0, ge=0)

# --------------------------------
# Helper Functions
# --------------------------------

def analyze_code_metrics(code: str) -> Dict[str, Any]:
    return {
        "lines": count_lines(code),
        "functions": count_functions(code),
        "loops": count_loops(code),
        "conditions": count_conditions(code),
        "complexity": get_complexity(code),
    }


# --------------------------------
# Routes
# --------------------------------

@app.get("/")
async def home() -> Dict[str, str]:
    return {
        "status": "success",
        "message": "AI Service Running"
    }



@app.post("/analyze")
async def analyze_code(request: CodeRequest) -> Dict[str, Any]:
    code = request.code

    # Step 1: Validate code before analysis
    validation = validate_code(code)

    if not validation["valid"]:
        raise HTTPException(
            status_code=400,
            detail={
                "message": validation["message"],
                "errors": validation["errors"],
            },
        )

    # Step 2: Analyze only valid Python code
    try:
        analysis = analyze_code_metrics(code.strip())

        return {
            "status": "success",
            "validation": validation,
            "analysis": analysis,
        }

    except Exception as e:
        logger.exception("Code analysis failed")
        raise HTTPException(
            status_code=500,
            detail="Code analysis failed",
        ) from e



@app.post("/behaviour")
async def behaviour_monitor(
    request: BehaviourRequest
) -> Dict[str, Any]:

    try:
        risk_level = calculate_risk(
            tab_switches=request.tab_switches,
            copy_paste_count=request.copy_paste_count,
            idle_time=request.idle_time,
        )

        return {
            "status": "success",
            "behaviour": {
                "tab_switches": request.tab_switches,
                "copy_paste_count": request.copy_paste_count,
                "idle_time": request.idle_time,
                "risk_level": risk_level,
            },
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        logger.exception("Behaviour monitoring failed")
        raise HTTPException(
            status_code=500,
            detail="Behaviour monitoring failed"
        ) from e


@app.post("/review")
async def review_code(request: CodeRequest) -> Dict[str, Any]:
    code = request.code

    # Step 1: Validate code
    validation = validate_code(code)

    if not validation["valid"]:
        raise HTTPException(
            status_code=400,
            detail={
                "message": validation["message"],
                "errors": validation["errors"],
            },
        )

    # Step 2: Perform code quality analysis
    try:
        review = analyze_code_quality(code)

        return {
            "status": "success",
            "validation": validation,
            "review": review,
        }

    except Exception as e:
        logger.exception("Code review failed")
        raise HTTPException(
            status_code=500,
            detail="Code review failed",
        ) from e


# --------------------------------
# Sprint 2 - Event Recording API
# --------------------------------

@app.post("/events/record")
async def create_event(request: EventRequest) -> Dict[str, Any]:

    try:
        event = record_event(
            session_id=request.session_id,
            event_type=request.event_type,
            duration_seconds=request.duration_seconds
        )

        return {
            "status": "success",
            "message": "Event recorded successfully",
            "event": event
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        logger.exception("Event recording failed")
        raise HTTPException(
            status_code=500,
            detail="Event recording failed"
        ) from e


# --------------------------------
# Sprint 2 - Event Processing API
# --------------------------------

@app.get("/events/process/{session_id}")
async def get_processed_events(session_id: str) -> Dict[str, Any]:

    try:
        result = process_events(session_id)

        return {
            "status": "success",
            "message": "Events processed successfully",
            "activity": result
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        logger.exception("Event processing failed")
        raise HTTPException(
            status_code=500,
            detail="Event processing failed"
        ) from e


# --------------------------------
# Sprint 2 - Behavioural Risk API
# --------------------------------

@app.get("/events/risk/{session_id}")
async def get_event_risk(session_id: str) -> Dict[str, Any]:

    try:
        # Step 1: Process recorded events
        activity = process_events(session_id)

        # Step 2: Calculate behavioural risk
        risk_level = calculate_risk(
            tab_switches=activity["tab_switches"],
            copy_paste_count=activity["copy_paste_count"],
            idle_time=activity["idle_time_minutes"]
        )

        # Step 3: Return activity and risk analysis
        return {
            "status": "success",
            "message": "Behavioural risk calculated successfully",
            "activity": activity,
            "risk_analysis": {
                "risk_level": risk_level
            }
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        logger.exception("Event risk analysis failed")
        raise HTTPException(
            status_code=500,
            detail="Event risk analysis failed"
        ) from e
