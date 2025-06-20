import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType

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

        retriever = self.vectorstore.as_retriever()

        self.tools = [
            Tool(
                name="BenchmarkRetriever",
                func=lambda q: "\n\n".join([doc.page_content for doc in retriever.get_relevant_documents(q)]),
                description="Useful for retrieving industry-standard OKRs or goals from a benchmark database."
            )
        ]

        self.agent_executor = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    def retrieve_benchmarks(self, interpreted_okr: dict) -> dict:
        try:
            user_query = f"""Given the following interpreted OKR JSON:

{json.dumps(interpreted_okr, indent=2)}

Use tools to retrieve relevant OKRs and generate:
- benchmarkedObjective
- benchmarkedKeyResults
- benchmarkedSkillFocus
- recommendedProficiencyLevel (junior/mid/senior)

Return only JSON."""
            
            result = self.agent_executor.invoke({"input": user_query})

            output = result.get("output", "").strip()
            cleaned = output.removeprefix("```json").removesuffix("```").strip()

            return json.loads(cleaned)

        except Exception as e:
            return {"error": str(e), "raw_output": output if 'output' in locals() else 'None'}
