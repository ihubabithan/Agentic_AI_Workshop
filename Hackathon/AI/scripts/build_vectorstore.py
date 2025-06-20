import os
import sys
import json
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from dotenv import load_dotenv

load_dotenv()

def print_usage():
    print("Usage: python build_vectorstore.py <input_json> <output_dir>")
    print("Example: python build_vectorstore.py agents/data/okr_examples.json vectorstores/okr_faiss")
    print("         python build_vectorstore.py agents/data/benchmark_corpus.json vectorstores/validation_faiss")
    sys.exit(1)

if len(sys.argv) != 3:
    print_usage()

input_json = sys.argv[1]
output_dir = sys.argv[2]

if not os.path.exists(input_json):
    print(f"Input file {input_json} does not exist.")
    sys.exit(1)

with open(input_json, "r", encoding="utf-8") as f:
    data = json.load(f)

docs = []
# Detect file type by keys in first item
if isinstance(data, list) and data and isinstance(data[0], dict):
    first_keys = set(data[0].keys())
    # OKR format
    if {"objective", "keyResults", "skillFocus", "ambiguityLevel"}.issubset(first_keys):
        for okr in data:
            content = (
                f"Objective: {okr['objective']}\n"
                f"Key Results: {', '.join(okr['keyResults'])}\n"
                f"Skill Focus: {', '.join(okr['skillFocus'])}\n"
                f"Ambiguity Level: {okr['ambiguityLevel']}"
            )
            docs.append(Document(page_content=content))
    # Benchmark format (assume 'question' and 'answer' keys)
    elif {"question", "answer"}.issubset(first_keys):
        for item in data:
            content = f"Question: {item['question']}\nAnswer: {item['answer']}"
            docs.append(Document(page_content=content))
    else:
        print("Unknown JSON format. Please adapt the script for your data.")
        sys.exit(1)
else:
    print("Input JSON must be a list of objects.")
    sys.exit(1)

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

vectorstore = FAISS.from_documents(chunks, embeddings)
vectorstore.save_local(output_dir)

print(f"✅ Vectorstore built successfully at {output_dir}.")
