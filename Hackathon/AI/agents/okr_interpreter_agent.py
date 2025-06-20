from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
import os
import json
from dotenv import load_dotenv
import re

class OKRInterpreterAgent:
    def __init__(self):
        load_dotenv()

        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
        embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        self.vectorstore = FAISS.load_local(
            "vectorstores/okr_faiss",
            embeddings=embedding,
            allow_dangerous_deserialization=True
        )

        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(),
            chain_type="stuff"
        )

        self.prompt_template = PromptTemplate.from_template("""
You are an OKR interpreter. Given the student’s cleaned OKR sentence and the retrieved examples below, extract:
- objective
- keyResults (as a list)
- skillFocus (as a list)
- ambiguityLevel (vague, moderate, clear)

Respond only in JSON format.

OKR Sentence:
"{okr_text}"
""")

    def interpret(self, okr_text: str) -> dict:
        prompt = self.prompt_template.format(okr_text=okr_text)
        response = self.qa_chain.run(prompt)

        try:
        # Remove triple backtick blocks like ```json ... ```
            cleaned_response = re.sub(r"```(?:json)?\s*([\s\S]*?)\s*```", r"\1", response).strip()
            return json.loads(cleaned_response)
        except Exception:
            return {"error": "Failed to parse response", "raw_output": response}
