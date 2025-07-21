import faiss, numpy as np
from langchain.embeddings.openai import OpenAIEmbeddings
from langgraph import Node

# Load and index dataset once (example items)
docs = ["Alpha beta gamma", "Delta epsilon zeta", "Eta theta iota"]
emb = OpenAIEmbeddings()
vects = np.array([emb.embed_query(d) for d in docs])
idx = faiss.IndexFlatL2(vects.shape[1])
idx.add(vects)

def rag_node(query, state):
    qv = emb.embed_query(query)
    D, I = idx.search(np.array([qv]), k=1)
    return docs[I[0][0]]

rag = Node(name="rag", func=rag_node)
