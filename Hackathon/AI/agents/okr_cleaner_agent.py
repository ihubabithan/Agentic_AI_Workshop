# agents/okr_sentence_agent.py

import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage

class OKRSentenceAgent:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not set")

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",  # or "gemini-pro", adjust if needed
            temperature=0.3,
            convert_system_message_to_human=True,
        )

        self.prompt_template = PromptTemplate.from_template("""
You are a professional OKR assistant.

Your job is to convert a clumsy or raw OKR JSON object into a single, well-written, professional OKR sentence called 'okr_text'.

🎯 Format:
"Clear and measurable objective with specific key results, focusing on key skills."

✅ Guidelines:
- Rewrite vague objectives (e.g., "get better at backend stuff") into specific and professional goals (e.g., "Improve backend development skills").
- Use action-oriented verbs like "Complete", "Build", "Learn", "Solve", "Develop", etc.
- Maintain grammatical correctness.
- Make it sound like something you'd proudly include in a professional goal tracker.
- Output only the sentence (no extra quotes or markdown).

📥 Input JSON:
{{
{okr_json}
}}

📤 Return only the okr_text:
""")

    def generate_okr_text(self, okr_data: dict) -> str:
        formatted_prompt = self.prompt_template.format(okr_json=json.dumps(okr_data, indent=2))
        response = self.llm.invoke([HumanMessage(content=formatted_prompt)])
        return response.content.strip()
