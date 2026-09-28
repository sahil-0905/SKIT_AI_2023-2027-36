from fastapi import FastAPI
from pydantic import BaseModel

from code_analysis.metrics import (
    count_lines,
    count_functions,
    count_loops,
    count_conditions,
)

from code_analysis.complexity import get_complexity
from behavioural.monitor import calculate_risk

app = FastAPI(
    title="AI Interview Coding Platform API",
    description="Code Analysis and Behaviour Monitoring Service",
    version="1.0.0"
)


# ==========================
# Request Models
# ==========================

class CodeRequest(BaseModel):
    code: str


class BehaviourRequest(BaseModel):
    tab_switches: int = 0
    copy_paste_count: int = 0
    idle_time: int = 0


# ==========================
# Health Check
# ==========================

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "AI Service Running"
    }


# ==========================
# Code Analysis API
# ==========================

@app.post("/analyze")
def analyze_code(request: CodeRequest):

    code = request.code

    lines = count_lines(code)
    functions = count_functions(code)
    loops = count_loops(code)
    conditions = count_conditions(code)
    complexity = get_complexity(code)

    return {
        "status": "success",
        "analysis": {
            "lines": lines,
            "functions": functions,
            "loops": loops,
            "conditions": conditions,
            "complexity": complexity
        }
    }


# ==========================
# Behaviour Monitoring API
# ==========================

@app.post("/behaviour")
def behaviour_monitor(request: BehaviourRequest):

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
            "risk_level": risk_level
        }
    }