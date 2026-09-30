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
from behavioural.monitor import calculate_risk

# --------------------------------
# Logging
# --------------------------------
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="AI Interview Coding Platform API",
    description="Code Analysis and Behaviour Monitoring Service",
    version="1.0.0",
)


# --------------------------------
# Request Models
# --------------------------------

class CodeRequest(BaseModel):
    code: str


class BehaviourRequest(BaseModel):
    tab_switches: int = Field(0, ge=0)
    copy_paste_count: int = Field(0, ge=0)
    idle_time: int = Field(0, ge=0)


# --------------------------------
# Health Check
# --------------------------------

@app.get("/")
async def home() -> Dict[str, str]:
    return {
        "status": "success",
        "message": "AI Service Running"
    }


# --------------------------------
# Code Analysis
# --------------------------------

@app.post("/analyze")
async def analyze_code(request: CodeRequest) -> Dict[str, Any]:
    try:
        code = request.code.strip()

        if not code:
            raise HTTPException(
                status_code=400,
                detail="Code cannot be empty"
            )

        analysis = {
            "lines": count_lines(code),
            "functions": count_functions(code),
            "loops": count_loops(code),
            "conditions": count_conditions(code),
            "complexity": get_complexity(code),
        }

        return {
            "status": "success",
            "analysis": analysis
        }

    except HTTPException:
        raise

    except Exception as e:
        logging.exception("Code analysis failed")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


# --------------------------------
# Behaviour Monitoring
# --------------------------------

@app.post("/behaviour")
async def behaviour_monitor(
    request: BehaviourRequest
) -> Dict[str, Any]:

    try:
        risk_level = calculate_risk(
            request.tab_switches,
            request.copy_paste_count,
            request.idle_time,
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

    except Exception as e:
        logging.exception("Behaviour monitoring failed")
        raise HTTPException(
            status_code=500,
            detail=f"Behaviour monitoring failed: {str(e)}"
        )