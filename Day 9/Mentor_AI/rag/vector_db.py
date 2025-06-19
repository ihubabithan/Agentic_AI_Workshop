from langchain.vectorstores import FAISS
from langchain.embeddings import GoogleGenerativeAIEmbeddings

GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

def get_retriever():
    embeddings = GoogleGenerativeAIEmbeddings(api_key=GEMINI_API_KEY, model="models/embedding-001")
    # Placeholder: Replace with real documents/examples
    texts = [
        "How to review a simple OKR submission.",
        "Escalation criteria for complex student tasks.",
        "Best practices for peer mentor validation.",
        "Case study: Senior mentor intervention.",
    ]
    vectorstore = FAISS.from_texts(texts, embedding=embeddings)
    return vectorstore.as_retriever() 