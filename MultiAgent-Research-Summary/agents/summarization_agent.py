from langchain import OpenAI
from langgraph import Node

llm = OpenAI(temperature=0)

def summarization_node(collected, state):
    prompt = "Summarize the following into bullet points:\n" + collected
    return llm(prompt)

summarizer = Node(name="summarizer", func=summarization_node)
