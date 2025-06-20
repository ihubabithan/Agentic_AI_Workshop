import os
import json
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType

class OKRInterpreterAgent:
    def __init__(self):
        load_dotenv()

        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        self.vectorstore = FAISS.load_local(
            "vectorstores/okr_faiss",
            embeddings=embeddings,
            allow_dangerous_deserialization=True
        )

        retriever = self.vectorstore.as_retriever()

        self.tools = [
            Tool(
                name="OKRExampleRetriever",
                func=lambda q: "\n\n".join([doc.page_content for doc in retriever.get_relevant_documents(q)]),
                description="Useful for retrieving OKR examples that match the current OKR sentence."
            )
        ]

        self.agent_executor = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    def interpret(self, okr_text: str) -> dict:
        try:
            prompt = f"""
You are an OKR interpreter.

Given the following cleaned OKR sentence:
"{okr_text}"

Use the OKRExampleRetriever tool to find relevant OKRs for reference.

Then extract and return:
- objective
- keyResults (as a list)
- skillFocus (as a list)
- ambiguityLevel (one of: vague, moderate, clear)

Respond only in this JSON format:
{{
  "objective": "...",
  "keyResults": ["...", "..."],
  "skillFocus": ["...", "..."],
  "ambiguityLevel": "..."
}}
"""

            result = self.agent_executor.invoke({"input": prompt})
            output = result.get("output", "").strip()

            # Clean if inside code fences
            cleaned = re.sub(r"```(?:json)?\s*([\s\S]*?)\s*```", r"\1", output).strip()
            return json.loads(cleaned)

        except Exception as e:
            return {
                "error": "Failed to parse interpreted OKR response",
                "raw_output": result.get("output", "") if 'result' in locals() else '',
                "exception": str(e)
            }
