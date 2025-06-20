import os
import json
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType


class ValidationAgent:
    def __init__(self):
        load_dotenv()

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.3
        )

        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        self.vectorstore = FAISS.load_local(
            "vectorstores/validation_faiss",
            embeddings=embeddings,
            allow_dangerous_deserialization=True
        )

        retriever = self.vectorstore.as_retriever()

        self.tools = [
            Tool(
                name="ValidationExampleRetriever",
                func=lambda q: "\n\n".join([doc.page_content for doc in retriever.get_relevant_documents(q)]),
                description="Helpful for reviewing how OKR validations are judged based on examples."
            )
        ]

        self.agent_executor = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=True  # ✅ enables retry or graceful fallback
        )

    def validate(self, okr: dict, benchmark: dict, evidence: dict) -> dict:
        try:
            prompt = f"""
You are a validation agent.

Compare the student's OKR, benchmark data, and collected evidence using relevant examples from the ValidationExampleRetriever tool.

Score the OKR with:
- relevance (0–50): Does evidence match the OKR goals?
- completeness (0–30): Are all key results met?
- quality (0–20): Depth and clarity of outcomes (optional)
- totalScore: Sum of above
- status: "pass" if totalScore >= 70, otherwise "fail"

📥 Inputs:
OKR:
{json.dumps(okr, indent=2)}

Benchmark:
{json.dumps(benchmark, indent=2)}

Evidence:
{json.dumps(evidence, indent=2)}

📤 Respond ONLY in JSON format like:
{{
  "relevance": 8,
  "completeness": 5,
  "quality": 4,
  "totalScore": 10,
  "status": "pass"
}}
"""

            result = self.agent_executor.invoke({"input": prompt})
            output = result.get("output", "").strip()

            # ✅ Remove markdown code block if returned
            if output.startswith("```json") or output.startswith("```"):
                output = re.sub(r"```(?:json)?\s*(.*?)\s*```", r"\1", output, flags=re.DOTALL).strip()

            return json.loads(output)

        except Exception as e:
            return {
                "error": "Failed to parse validation output",
                "raw_output": result.get("output", "") if 'result' in locals() else '',
                "exception": str(e)
            }
