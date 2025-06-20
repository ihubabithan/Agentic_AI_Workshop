# agents/validation_agent.py

import os
import json
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
import re


class ValidationAgent:
    def __init__(self):
        load_dotenv()
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        self.vectorstore = FAISS.load_local(
            "vectorstores/validation_faiss",  # Use your validation examples
            embeddings=embeddings,
            allow_dangerous_deserialization=True
        )

        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(),
            chain_type="stuff"
        )

        self.prompt_template = PromptTemplate.from_template("""
You are a validation agent. Your job is to compare the student's OKR, benchmark data, and gathered evidence and return a structured JSON response assessing:

- Relevance (0-50): Does evidence match the OKR?
- Completeness (0-30): Are all key results achieved?
- Quality (0-20): Does the evidence indicate depth (optional)?
- Final status: "pass" if total >= 70, else "fail"

Use your judgment based on retrieved examples.

Student OKR:
{okr}

Benchmark Expectations:
{benchmark}

Evidence Summary:
{evidence}

Return only JSON with the keys: relevance, completeness, quality, totalScore, status.
""")

    def validate(self, okr: dict, benchmark: dict, evidence: dict) -> dict:
        prompt = self.prompt_template.format(
            okr=json.dumps(okr, indent=2),
            benchmark=json.dumps(benchmark, indent=2),
            evidence=json.dumps(evidence, indent=2)
        )

        response = self.qa_chain.run(prompt)

        # Clean code block if returned
        cleaned_response = re.sub(r"```(?:json)?\n(.*?)```", r"\1", response, flags=re.DOTALL).strip()

        try:
            return json.loads(cleaned_response)
        except Exception:
            return {"error": "Failed to parse validation output", "raw_output": response}
