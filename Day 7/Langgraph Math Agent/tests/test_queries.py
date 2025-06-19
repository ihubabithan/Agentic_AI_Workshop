from agent.langgraph_setup import build_graph

def test():
    agent = build_graph()
    test_cases = [
        "What is the capital of France?",
        "What is 7 plus 5?",
        "How much is 10 divided by 2?",
        "Who is the CEO of Tesla?"
    ]
    for query in test_cases:
        print(f"\nQ: {query}")
        res = agent.invoke({"query": query})
        print(f"A: {res['result']}")

if __name__ == "__main__":
    test()
