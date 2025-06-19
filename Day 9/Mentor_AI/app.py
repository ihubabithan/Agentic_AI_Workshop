import streamlit as st
import json
from agents.task_assessment_agent import run_task_assessment
from agents.delegation_decision_agent import run_delegation_decision
from agents.knowledge_support_agent import run_knowledge_support
from agents.mentor_analytics_agent import run_mentor_analytics
from data.sample_submissions import SAMPLE_SUBMISSIONS

st.set_page_config(page_title="Mentor AI - Multi-Agent System", layout="wide")

st.title("Mentor AI: Multi-Agent Submission Routing & Validation")

st.markdown("""
This system optimizes mentor time by intelligently routing and validating student submissions using a sequence of autonomous AI agents.

**Agents:**
- Task Assessment Agent
- Delegation Decision Agent
- Knowledge Support Agent (RAG-Enabled)
- Mentor Analytics Agent
""")

# Add a selectbox for sample submissions
selected_submission = st.selectbox(
    "Select a sample submission or enter your own below:",
    options=[f"{sub['id']} - {sub['title']}" for sub in SAMPLE_SUBMISSIONS],
    index=0
)

# Get the selected submission details
selected_sub = next(sub for sub in SAMPLE_SUBMISSIONS if sub['id'] in selected_submission)
submission = st.text_area(
    "Student submission details:",
    value=json.dumps(selected_sub, indent=2),
    height=300
)

if st.button("Submit for Assessment"):
    st.info("Processing through multi-agent pipeline...")
    
    # 1. Task Assessment
    assessment = run_task_assessment(submission)
    st.subheader("1. Task Assessment Agent Output")
    st.json(assessment)

    # 2. Delegation Decision
    delegation = run_delegation_decision(assessment)
    st.subheader("2. Delegation Decision Agent Output")
    st.json(delegation)

    # 3. Knowledge Support (RAG)
    knowledge = run_knowledge_support(submission)
    st.subheader("3. Knowledge Support Agent Output")
    st.write(knowledge)

    # 4. Mentor Analytics (using submission data)
    mentor_logs = {
        "logs": [
            f"Submission {selected_sub['id']} processed",
            f"Complexity: {selected_sub['complexity']}",
            f"Urgency: {selected_sub['urgency']}"
        ]
    }
    analytics = run_mentor_analytics(json.dumps(mentor_logs))
    st.subheader("4. Mentor Analytics Agent Output")
    st.json(analytics) 