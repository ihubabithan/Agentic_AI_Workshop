import re
from langgraph import Node

def is_web_query(query: str) -> bool:
    return bool(re.search(r'\b(latest|today|current|recent)\b', query, re.IGNORECASE))

def router_node(query, state):
    if is_web_query(query):
        return ("web_research", query)
    elif query.startswith("DATASET:"):
        return ("rag", query.replace("DATASET:", "").strip())
    else:
        return ("llm", query)

router = Node(name="router", func=router_node)
