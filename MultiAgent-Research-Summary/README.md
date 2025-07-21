# Multi-Agent Research & Summarization System

This project uses **LangGraph** to process questions with:

- **Router Agent**: directs query to Web or RAG or LLM
- **Web Research Agent**: inline web search from Wikipedia
- **RAG Agent**: performs local knowledge-base lookup
- **Summarization Agent**: compiles answer via GPT

## 🧠 Workflow

1. Input query goes through Router
2. Web or RAG produces raw text
3. Summarizer formats final answer

## ⚙️ Setup

```bash
cd multiagent_research_summarizer
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

📌 Test Queries
matlab
Copy
Edit
latest COVID-19 stats
DATASET: Alpha beta gamma
Explain quantum entanglement in simple language
