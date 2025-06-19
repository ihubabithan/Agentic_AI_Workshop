from langchain.agents import initialize_agent, Tool, AgentType
from langchain_google_genai import GoogleGenerativeAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY", "AIzaSyB_h6tUZaWSkabVvBZT7S9LPMXNAJvT-wM")
llm = GoogleGenerativeAI(credentials=api_key, model="gemini-2.0-flash")

def decide_delegation(assessment_json: str) -> str:
    prompt = f"""
    Given the following assessment of a student submission (in JSON):
    {assessment_json}
    
    Decide the appropriate routing:
    - Auto-validate if simple and low urgency
    - Assign to peer mentor if moderate
    - Escalate to senior mentor if complex or high urgency
    
    Respond in JSON with keys: routing_decision, reason.
    """
    return llm(prompt)

delegation_tool = Tool(
    name="Delegation Decision",
    func=decide_delegation,
    description="Decides routing: auto-validate, assign to peer mentor, or escalate to senior mentor."
)

delegation_decision_agent = initialize_agent(
    tools=[delegation_tool],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

def run_delegation_decision(assessment_json: str):
    return delegation_decision_agent.run(assessment_json) 