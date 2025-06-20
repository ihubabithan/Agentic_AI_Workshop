# main.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from agents.okr_cleaner_agent import OKRSentenceAgent
from agents.okr_interpreter_agent import OKRInterpreterAgent
from agents.benchmark_retriever_agent import BenchmarkRetrieverAgent
from agents.evidence_monitor_agent import EvidenceMonitorAgent
from agents.validation_agent import ValidationAgent
from agents.feedback_generator_agent import FeedbackGeneratorAgent
from agents.progress_tracker_agent import ProgressTrackerAgent


import logging

app = FastAPI()

class OKRInput(BaseModel):
    userId: str
    name: str
    leetcodeId: str
    githubId: str
    linkedinId: str
    objective: str
    keyResults: List[str]
    skillFocus: List[str]
    ambiguityLevel: str

@app.post("/submit_okr")
def generate_okr_text(request: OKRInput):
    try:
        # Step 1: Convert clumsy OKR to a single clean sentence
        sentence_agent = OKRSentenceAgent()
        okr_text = sentence_agent.generate_okr_text(request.dict())

        # # Step 2: Interpret the structured data using RAG
        interpreter_agent = OKRInterpreterAgent()
        structured_okr = interpreter_agent.interpret(okr_text)

        # # Step 3: Retrieve benchmark data using another RAG agent
        benchmark_agent = BenchmarkRetrieverAgent()
        benchmark_data = benchmark_agent.retrieve_benchmarks(structured_okr)

        # Step 4: Return the entire response
        evidence_agent = EvidenceMonitorAgent()
        evidence_data = evidence_agent.validate(request.dict())

        validation_agent = ValidationAgent()
        validation_output = validation_agent.validate(
            structured_okr,
            benchmark_data,
            evidence_data
        )

        feedback_agent = FeedbackGeneratorAgent()
        feedback_output = feedback_agent.generate_feedback(
            structured_okr,
            benchmark_data,
            validation_output
        )

        progress_agent = ProgressTrackerAgent()
        progress_output = progress_agent.track(
            validation=validation_output,
            feedback=feedback_output,
            evidence=evidence_data
        )

        return {
            "cleaned_okr_text": okr_text,
            "structured_okr": structured_okr,
            "benchmarks": benchmark_data,
            "evidence": evidence_data,
            "validation": validation_output,
            "feedback": feedback_output,
            "progress": progress_output.dict()  # if Pydantic object
        }

    except Exception as e:
        logging.exception("Failed to process OKR pipeline")
        return {
            "error": str(e)
        }
