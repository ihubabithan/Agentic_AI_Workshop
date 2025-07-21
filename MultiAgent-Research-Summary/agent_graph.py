from langgraph import Graph, Edge
from agents.router_agent import router
from agents.web_research_agent import web_research
from agents.rag_agent import rag
from agents.summarization_agent import summarizer

graph = Graph()
graph.add_node(router)
graph.add_node(web_research)
graph.add_node(rag)
graph.add_node(summarizer)

# Connections
graph.add_edge(Edge("router", "web_research"))
graph.add_edge(Edge("router", "rag"))
# Always summarize after the research
graph.add_edge(Edge("web_research", "summarizer"))
graph.add_edge(Edge("rag", "summarizer"))
