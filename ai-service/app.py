from fastapi import FastAPI
from pydantic import BaseModel

from code_analysis.metrics import (
    count_lines,
    count_functions,
    count_loops,
    count_conditions
)

from code_analysis.complexity import get_complexity
from behavioural.monitor import calculate_risk

app = FastAPI()


class CodeRequest(BaseModel):
    code: str


class BehaviourRequest(BaseModel):
    tab_switches: int
    copy_paste_count: int
    idle_time: int


@app.get("/")
def home():
    return {
        "message": "AI Service Running"
    }


@app.post("/analyze")
def analyze_code(request: CodeRequest):

    code = request.code

    return {
        "lines": count_lines(code),
        "functions": count_functions(code),
        "loops": count_loops(code),
        "conditions": count_conditions(code),
        "complexity": get_complexity(code)
    }


@app.post("/behaviour")
def behaviour_monitor(request: BehaviourRequest):

    return {
        "tab_switches": request.tab_switches,
        "copy_paste_count": request.copy_paste_count,
        "idle_time": request.idle_time,
        "risk_level": calculate_risk(
            request.tab_switches,
            request.copy_paste_count,
            request.idle_time
        )
    }