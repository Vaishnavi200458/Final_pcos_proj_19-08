import os
from pathlib import Path

from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from uuid import uuid4


BASE_DIR = Path(__file__).resolve().parent.parent
PRIVATE_DB_PATH = BASE_DIR / "user_chroma_db"


class PrivateDocumentStore:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2"
        )

        self.vector_store = Chroma(
            collection_name="private_user_documents",
            persist_directory=str(PRIVATE_DB_PATH),
            embedding_function=self.embeddings,
        )
    
    def add_user_documents(self, user_id: str, documents):
        if not user_id:
            raise ValueError("A valid user ID is required.")

        if not documents:
            raise ValueError("No document content was provided.")

        for document in documents:
            document.metadata["user_id"] = user_id

        ids = [str(uuid4()) for _ in documents]

        self.vector_store.add_documents(
            documents=documents,
            ids=ids,
        )

        return len(documents)

    def get_user_documents(self, user_id: str, question: str):
        if not user_id:
            raise ValueError("A valid user ID is required.")

        # Check whether this user has uploaded any documents.
        existing_docs = self.vector_store.get(
            where={"user_id": user_id},
            limit=1,
        )

        if not existing_docs["ids"]:
            return []

        # Search only this user's private documents.
        return self.vector_store.similarity_search(
            question,
            k=4,
            filter={"user_id": user_id},
        )