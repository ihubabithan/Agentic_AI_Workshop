# agents/progress_tracker_agent.py

import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from agents.schema.schemas import ProgressReport

load_dotenv()

class ProgressTrackerAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )

        self.parser = PydanticOutputParser(pydantic_object=ProgressReport)

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an OKR progress tracker. Analyze the user's OKR status and generate a progress report."),
            ("human", """
Validation Data:
{validation}

Feedback:
{feedback}

Evidence:
{evidence}

Format the output as JSON that conforms to the schema below:
{format_instructions}
""")
        ])

        self.chain = self.prompt | self.llm | self.parser

    def track(self, validation, feedback, evidence):
        return self.chain.invoke({
            "validation": json.dumps(validation),
            "feedback": json.dumps(feedback),
            "evidence": json.dumps(evidence),
            "format_instructions": self.parser.get_format_instructions()
        })
