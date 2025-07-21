import requests
from langgraph import Node

def web_research_node(query, state):
    res = requests.get("https://api.allorigins.win/raw", params={"url": f"https://en.wikipedia.org/wiki/{query}"})
    return res.text[:1000]  # snippet

web_research = Node(name="web_research", func=web_research_node)
