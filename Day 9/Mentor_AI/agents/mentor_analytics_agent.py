from langchain.agents import initialize_agent, Tool, AgentType
from langchain_google_genai import GoogleGenerativeAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY", "AIzaSyB_h6tUZaWSkabVvBZT7S9LPMXNAJvT-wM")
llm = GoogleGenerativeAI(credentials=api_key, model="gemini-2.0-flash")

def analyze_mentor_analytics(logs: str) -> str:
    prompt = f"""
    Given the following mentor intervention logs (as JSON or text):
    {logs}
    
    Analyze and summarize:
    - Mentor workload (number of cases, distribution)
    - Types of interventions (auto, peer, senior)
    - Effort distribution over time
    
    Respond in JSON with keys: workload_summary, intervention_types, effort_distribution, recommendations.
    """
    return llm(prompt)

analytics_tool = Tool(
    name="Mentor Analytics",
    func=analyze_mentor_analytics,
    description="Tracks mentor workload, intervention types, and effort distribution."
)

mentor_analytics_agent = initialize_agent(
    tools=[analytics_tool],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

def run_mentor_analytics(logs: str):
    return mentor_analytics_agent.run(logs) 