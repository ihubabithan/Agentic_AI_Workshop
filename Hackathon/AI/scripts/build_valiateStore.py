import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

def create_validation_vectorstore():
    # Load API key from .env file
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables or .env file.")

    os.environ["GOOGLE_API_KEY"] = api_key  # required by langchain_google_genai

    # Ensure the directory exists
    os.makedirs("vectorstores", exist_ok=True)

    # Example documents
    documents = [
        Document(page_content="Example OKR: Build a full-stack project using LangChain and Streamlit"),
        Document(page_content="Benchmark: 3 GitHub commits, 1 blog post, code uses LangChain agents correctly"),
        Document(page_content="Evidence: GitHub repo with agent-based architecture, 1 blog post published"),
    ]

    # Create embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    # Optional sanity check
    print("Test embedding:", embeddings.embed_query("LangChain project"))

    # Create FAISS vector store
    vectorstore = FAISS.from_documents(documents, embedding=embeddings)

    # Save locally
    vectorstore.save_local("vectorstores/validation_faiss")
    print("✅ Vectorstore saved at:", os.path.abspath("vectorstores/validation_faiss"))

if __name__ == "__main__":
    create_validation_vectorstore()
