from agent.langgraph_setup import build_graph

if __name__ == "__main__":
    agent = build_graph()
    
    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            break
        result = agent.invoke({"query": query})
        print("Agent:", result["result"])
