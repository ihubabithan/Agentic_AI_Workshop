# agents/progress_tracker_agent.py

import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType

load_dotenv()

class ProgressTrackerAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.4,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )

        self.tools = [
            Tool(
                name="MilestoneHelper",
                func=lambda x: "Use this only if you need examples of student progress stages.",
                description="Can provide general advice on how to judge progress stages based on key results."
            )
        ]

        self.agent_executor = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    def track(self, validation, feedback, evidence):
        try:
            prompt = f"""
You are an OKR progress tracker.

Your task is to generate a progress report based on the following inputs:

Validation:
{json.dumps(validation, indent=2)}

Feedback:
{json.dumps(feedback, indent=2)}

Evidence:
{json.dumps(evidence, indent=2)}

Return only a JSON object with the following fields:
{{
  "progressSummary": "Short summary of how the student is doing",
  "milestoneCompletion": ["milestone1", "milestone2", "..."],
  "feedbackIncorporation": "How well feedback was acted on",
  "trendAnalysis": "Progress trend (improving/stagnating/regressing)"
}}
"""
            result = self.agent_executor.invoke({"input": prompt})

            output = result.get("output", "").strip()
            cleaned = output.removeprefix("```json").removesuffix("```").strip()

            return json.loads(cleaned)

        except Exception as e:
            return {
                "error": "Failed to parse progress report",
                "exception": str(e),
                "raw_output": result.get("output", "") if 'result' in locals() else ''
            }
