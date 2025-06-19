from langchain.agents import initialize_agent, Tool, AgentType
from langchain_google_genai import GoogleGenerativeAI
import os
from dotenv import load_dotenv
from pydantic import SecretStr

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY", "AIzaSyB_h6tUZaWSkabVvBZT7S9LPMXNAJvT-wM")
llm = GoogleGenerativeAI(credentials=api_key, model="gemini-2.0-flash")

def analyze_submission(submission: str) -> str:
    # Placeholder logic for complexity, urgency, and performance pattern analysis
    prompt = f"""
    Analyze the following student submission for:
    - Complexity (simple, moderate, complex)
    - Urgency (low, medium, high)
    - Any historical performance patterns if mentioned
    
    Submission: {submission}
    
    Respond in JSON with keys: complexity, urgency, notes.
    """
    return llm(prompt)

analyze_tool = Tool(
    name="Task Assessment",
    func=analyze_submission,
    description="Analyzes student submission for complexity, urgency, and performance patterns."
)

task_assessment_agent = initialize_agent(
    tools=[analyze_tool],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

def run_task_assessment(submission: str):
    return task_assessment_agent.run(submission) 