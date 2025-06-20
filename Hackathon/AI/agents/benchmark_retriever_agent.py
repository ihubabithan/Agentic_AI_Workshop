# agents/benchmark_retriever_agent.py

import json
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class BenchmarkRetrieverAgent:
    def __init__(self):
        load_dotenv()
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.4)
        embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        self.vectorstore = FAISS.load_local(
            "vectorstores/benchmark_faiss",
            embeddings=embedding,
            allow_dangerous_deserialization=True
        )
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(),
            chain_type="stuff"
        )
        self.prompt_template = PromptTemplate.from_template("""
You are an OKR benchmarking assistant.

Given the interpreted OKR JSON, use external examples and domain knowledge to return:
- benchmarkedObjective: refined goal
- benchmarkedKeyResults: measurable results aligned with industry standards
- benchmarkedSkillFocus: deeper technical/soft skills
- recommendedProficiencyLevel: junior, mid, senior

Respond in JSON only.

Input OKR:
{okr}
""")

    def retrieve_benchmarks(self, interpreted_okr: dict) -> dict:
        prompt = self.prompt_template.format(okr=json.dumps(interpreted_okr, indent=2))
        response = self.qa_chain.run(prompt)

        # Clean and strip markdown/code fences if present
        cleaned = response.strip().removeprefix("```json").removesuffix("```").strip()

        try:
            return json.loads(cleaned)
        except Exception:
            return {"error": "Failed to parse benchmark response", "raw_output": response}
