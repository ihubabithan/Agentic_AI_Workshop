# Day 9 Mentor AI - Multi-Agent Submission Routing & Validation

## Project Description
Day 9 Mentor AI is a Streamlit-based web application designed to optimize mentor time by intelligently routing and validating student submissions using a sequence of autonomous AI agents. The system leverages advanced AI models to assess task complexity, delegate tasks appropriately, provide knowledge support, and analyze mentor workload.

## Features
- **Task Assessment Agent:** Analyzes student submissions for complexity, urgency, and performance patterns.
- **Delegation Decision Agent:** Decides routing of submissions for auto-validation, peer mentoring, or senior mentor escalation.
- **Knowledge Support Agent:** Provides relevant references and examples using Retrieval-Augmented Generation (RAG) for peer reviewers or mentors.
- **Mentor Analytics Agent:** Tracks mentor workload, intervention types, and effort distribution to optimize mentoring resources.

## Installation

### Prerequisites
- Python 3.8 or higher

### Install dependencies
From the `Day 9/Mentor_AI` directory, run:
```bash
pip install -r requirements.txt
```

## Usage

### Running the app
From the `Day 9/Mentor_AI` directory, run:
```bash
streamlit run app.py
```

### Using the app
- Select a sample submission or enter your own student submission details.
- Submit the data for assessment.
- View outputs from each AI agent in the multi-agent pipeline:
  1. Task Assessment Agent Output
  2. Delegation Decision Agent Output
  3. Knowledge Support Agent Output
  4. Mentor Analytics Agent Output

## File Structure
```
Day 9/Mentor_AI/
├── app.py                      # Main Streamlit application
├── requirements.txt            # Python dependencies
├── agents/                    # AI agent modules
│   ├── task_assessment_agent.py
│   ├── delegation_decision_agent.py
│   ├── knowledge_support_agent.py
│   └── mentor_analytics_agent.py
├── data/                      # Data files and sample submissions
│   ├── sample_submissions.py
│   └── mentor_knowledge.py
├── rag/                       # Retrieval-Augmented Generation modules
│   └── vector_db.py
```

## Dependencies
- streamlit
- langchain
- langchain-google-genai
- google-generativeai
- pydantic
- python-dotenv

## Example Data
Sample student submissions include projects such as:
- Basic Python Calculator
- ML Model Deployment
- React Component Library
- Database Schema Update

These examples demonstrate the variety of tasks the system can assess and route.

---

This project provides an AI-powered, multi-agent system to assist mentors in efficiently managing and validating student submissions.
