import os
import json
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType


class FeedbackGeneratorAgent:
    def __init__(self):
        load_dotenv()
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.4
        )
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        self.vectorstore = FAISS.load_local(
            "vectorstores/feedback_faiss",
            embeddings=embeddings,
            allow_dangerous_deserialization=True
        )

        retriever = self.vectorstore.as_retriever()

        self.tools = [
            Tool(
                name="FeedbackRAGRetriever",
                func=lambda q: "\n\n".join([doc.page_content for doc in retriever.get_relevant_documents(q)]),
                description="Useful for retrieving high-quality feedback suggestions, tutorials, and improvement strategies based on OKRs."
            )
        ]

        self.agent_executor = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=True  # ✅ enables retry on parsing failure
        )

    def generate_feedback(self, okr: dict, benchmark: dict, validation: dict) -> dict:
        try:
            prompt = f"""
You are a feedback assistant for student OKRs.

Given the following data:
OKR:
{json.dumps(okr, indent=2)}

Benchmark:
{json.dumps(benchmark, indent=2)}

Validation:
{json.dumps(validation, indent=2)}

Generate a comprehensive feedback report with the following sections:
1. progressSummary - Briefly summarize the student’s performance.
2. gaps - A list of missing or weak areas.
3. nextSteps - A checklist of what the student should do next.
4. resources - A list of helpful learning materials, using the FeedbackRAGRetriever tool.

Respond ONLY in this JSON format:
{{
  "progressSummary": "...",
  "gaps": ["...", "..."],
  "nextSteps": ["...", "..."],
  "resources": [
    {{
      "title": "...",
      "type": "course/tutorial/article",
      "link": "..."
    }}
  ]
}}
"""

            result = self.agent_executor.invoke({"input": prompt})
            output = result.get("output", "").strip()

            # ✅ Clean markdown code block
            if output.startswith("```json") or output.startswith("```"):
                output = re.sub(r"```(?:json)?\s*(.*?)\s*```", r"\1", output, flags=re.DOTALL).strip()

            return json.loads(output)

        except Exception as e:
            return {
                "error": "Failed to parse feedback output",
                "raw_output": result.get("output", "") if 'result' in locals() else '',
                "exception": str(e)
            }
