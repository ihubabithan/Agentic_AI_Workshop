import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType

class OKRSentenceAgent:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not set")

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.3
        )

        # Tool not required now, but keeping one placeholder tool in case we extend later
        self.tools = [
            Tool(
                name="NoneTool",
                func=lambda x: "No external tool needed for this task.",
                description="Placeholder for future tool use."
            )
        ]

        self.agent_executor = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    def generate_okr_text(self, okr_data: dict) -> str:
        try:
            input_text = f"""
You are a professional OKR assistant.

Your job is to convert this raw OKR JSON object into a single, professional OKR sentence called 'okr_text'.

🎯 Format:
"Clear and measurable objective with specific key results, focusing on key skills."

✅ Guidelines:
- Rewrite vague objectives (e.g., "get better at backend stuff") into specific and professional goals.
- Use action verbs like "Complete", "Build", "Learn", "Solve", etc.
- Maintain grammatical correctness.
- Make it professional and concise.
- Output only the sentence.

📥 Input JSON:
{json.dumps(okr_data, indent=2)}

📤 Return only the okr_text (no quotes, no markdown).
"""

            result = self.agent_executor.invoke({"input": input_text})
            return result.get("output", "").strip()

        except Exception as e:
            return f"Error: {str(e)}"
