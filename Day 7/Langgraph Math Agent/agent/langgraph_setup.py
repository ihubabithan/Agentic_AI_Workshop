from langgraph.graph import StateGraph, END
from langchain_core.runnables import RunnableLambda
from typing import TypedDict
from .llm import get_llm
from .tools import plus, subtract, multiply, divide
from .router import is_math_query, parse_math_query

# ✅ Define the expected state structure
class AgentState(TypedDict):
    query: str
    result: str

def math_node(state: AgentState) -> AgentState:
    query = state['query']
    a, op, b = parse_math_query(query)

    result = "Invalid query"
    if op in ["plus", "add"]:
        result = plus(a, b)
    elif op in ["minus", "subtract"]:
        result = subtract(a, b)
    elif op in ["times", "multiply"]:
        result = multiply(a, b)
    elif op in ["divided by", "divide"]:
        result = divide(a, b)

    return {"query": query, "result": str(result)}

def llm_node(state: AgentState) -> AgentState:
    llm = get_llm()
    response = llm.invoke(state["query"])
    return {"query": state["query"], "result": response.content}

def build_graph():
    builder = StateGraph(AgentState)

    # Add LLM and math nodes
    builder.add_node("llm", RunnableLambda(llm_node))
    builder.add_node("math", RunnableLambda(math_node))

    # ✅ router node just passes state forward
    def router_node(state: AgentState) -> AgentState:
        return state

    # ✅ decision logic (not a node!)
    def route(state: AgentState) -> str:
        return "math" if is_math_query(state["query"]) else "llm"

    # Add router node
    builder.add_node("router", RunnableLambda(router_node))

    # Route to either math or LLM based on condition
    builder.add_conditional_edges("router", route, {
        "math": "math",
        "llm": "llm"
    })

    builder.set_entry_point("router")
    builder.add_edge("math", END)
    builder.add_edge("llm", END)

    return builder.compile()


