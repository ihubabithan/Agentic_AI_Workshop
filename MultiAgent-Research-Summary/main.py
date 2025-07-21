from agent_graph import graph

def main():
    print("🔍 Multi-Agent Research & Summarizer")
    while True:
        q = input("You: ")
        if q.lower() in ("exit", "quit"):
            break

        result = graph.run({"query": q})
        print("\n📄 Summary:\n", result)

if __name__ == "__main__":
    main()
