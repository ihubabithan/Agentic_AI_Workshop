# agents/feedback_generator_agent.py

import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

class FeedbackGeneratorAgent:
    def __init__(self):
        load_dotenv()
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.4)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        self.vectorstore = FAISS.load_local(
            "vectorstores/feedback_faiss",
            embeddings=embeddings,
            allow_dangerous_deserialization=True
        )

        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(),
            chain_type="stuff"
        )

        self.prompt_template = PromptTemplate.from_template("""
You are a feedback assistant for student OKRs.

Given:
- OKR details
- Benchmarks
- Validation score and status

Generate structured and human-readable feedback containing:

1. Progress Summary
2. Gaps Identified
3. Next Steps
4. Learning Resource Recommendations (use your RAG examples)

Respond in this JSON format:
{{
  "progressSummary": "...",
  "gaps": [...],
  "nextSteps": [...],
  "resources": [
    {{
      "title": "...",
      "type": "course/tutorial/article",
      "link": "..."
    }}
  ]
}}

OKR:
{okr}

Benchmark:
{benchmark}

Validation:
{validation}
""")

    def generate_feedback(self, okr: dict, benchmark: dict, validation: dict) -> dict:
        prompt = self.prompt_template.format(
            okr=json.dumps(okr, indent=2),
            benchmark=json.dumps(benchmark, indent=2),
            validation=json.dumps(validation, indent=2)
        )
    
        response = self.qa_chain.run(prompt)
    
        # Clean up markdown-style code block if present
        cleaned_response = response.strip()
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response.removeprefix("```json").strip()
        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response.removesuffix("```").strip()
    
        try:
            return json.loads(cleaned_response)
        except Exception as e:
            return {
                "error": "Failed to parse feedback output",
                "raw_output": response,
                "cleaned_response": cleaned_response,
                "exception": str(e)
            }
