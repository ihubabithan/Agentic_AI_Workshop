from langchain.agents import initialize_agent, Tool, AgentType
from langchain_google_genai import GoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.chains import RetrievalQA
import os
from dotenv import load_dotenv
from data.mentor_knowledge import MENTOR_KNOWLEDGE_BASE

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY", "AIzaSyB_h6tUZaWSkabVvBZT7S9LPMXNAJvT-wM")
llm = GoogleGenerativeAI(credentials=api_key, model="gemini-2.0-flash")
embeddings = GoogleGenerativeAIEmbeddings(credentials=api_key, model="models/embedding-001")

# Initialize Chroma with comprehensive knowledge base
vectorstore = Chroma.from_documents(
    documents=MENTOR_KNOWLEDGE_BASE,
    embedding=embeddings,
    persist_directory="./data/chroma_db"
)

# Create retriever with search parameters
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={
        "k": 3,  # Return top 3 most relevant documents
        "fetch_k": 5  # Fetch top 5 then rerank
    }
)

# Create RAG chain with specific prompt template
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={
        "prompt": """
        Based on the following context from our mentoring knowledge base:
        {context}
        
        Please provide a detailed response to this query:
        {question}
        
        Consider:
        1. Specific guidelines and processes that apply
        2. Best practices and common patterns
        3. Time management and efficiency aspects
        4. When to escalate vs. handle directly
        
        Format your response clearly with sections and bullet points where appropriate.
        """
    }
)

def provide_knowledge_support(query: str) -> str:
    """Use RAG to provide context-aware responses"""
    result = qa_chain({"query": query})
    
    # Format response with sources and metadata
    sources = []
    for doc in result['source_documents']:
        sources.append(f"- {doc.metadata['category']} ({doc.metadata['complexity']} complexity)")
    
    response = f"""
    Answer: {result['result']}
    
    Sources Referenced:
    {chr(10).join(sources)}
    """
    return response

knowledge_tool = Tool(
    name="Knowledge Support",
    func=provide_knowledge_support,
    description="Provides relevant references and examples using RAG for peer reviewers or mentors."
)

knowledge_support_agent = initialize_agent(
    tools=[knowledge_tool],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

def run_knowledge_support(query: str):
    return knowledge_support_agent.run(query) 