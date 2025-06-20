# generate_feedback_vectorstore.py

import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

# Use Gemini embedding model
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Example documents for feedback RAG
feedback_docs = [
    Document(
        page_content="""
        For OKRs focused on mastering DSA, students should aim to solve at least 50 problems 
        covering arrays, trees, graphs, and recursion. Ideal progress includes completion of 
        NeetCode or Leetcode Top 150.
        """,
        metadata={"source": "DSA_Benchmark"}
    ),
    Document(
        page_content="""
        A typical backend development OKR includes building 3 Node.js projects, integrating MongoDB, 
        and applying Express middleware. Deployment is encouraged via platforms like Vercel or Render.
        """,
        metadata={"source": "Backend_Benchmark"}
    ),
    Document(
        page_content="""
        Missing graph problems is a common gap. Recommend solving 10 problems from the Graphs category 
        on NeetCode or GeeksforGeeks. Use visualization tools for better understanding.
        """,
        metadata={"source": "Graph_Gap_Fix"}
    ),
    Document(
        page_content="""
        If quality is low, the student can be guided to refactor code, write test cases, and follow 
        clean code practices. Recommend tutorials from Educative or freeCodeCamp.
        """,
        metadata={"source": "Quality_Improvement"}
    ),
]

# Create vectorstore
vectorstore = FAISS.from_documents(feedback_docs, embeddings)

# Save to local directory
vectorstore.save_local("vectorstores/feedback_faiss")

print("✅ feedback_faiss vectorstore created.")
