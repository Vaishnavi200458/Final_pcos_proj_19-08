import os
import uuid

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings
)

from langchain_chroma import Chroma

from .pdf_processor import load_and_split_pdf


load_dotenv()


class PCOSRAG:

    def __init__(self):

        # -----------------------------------------
        # Gemini embedding model
        # -----------------------------------------

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2"
        )

        # -----------------------------------------
        # Gemini language model
        # -----------------------------------------

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3.6-flash"
        )

        # -----------------------------------------
        # Chroma database path
        # -----------------------------------------

        backend_dir = os.path.dirname(
          os.path.dirname(os.path.abspath(__file__))
        )

        self.chroma_path = os.path.join(
         backend_dir,
         "chroma_db"
        )

        chroma_path = self.chroma_path

        # -----------------------------------------
        # Load existing permanent knowledge base
        # -----------------------------------------

        if os.path.exists(chroma_path):

            self.vector_store = Chroma(
                persist_directory=chroma_path,
                embedding_function=self.embeddings
            )

            print(
                "Permanent PCOS knowledge base loaded."
            )

        else:

            self.vector_store = None

            print(
                "No existing knowledge base found."
            )

    def add_pdf(self, file_path):

        try:

            print(
                f"Processing uploaded PDF: {file_path}"
            )

            # -----------------------------------------
            # 1. Load and split PDF
            # -----------------------------------------

            chunks = load_and_split_pdf(
                file_path
            )

            print(
                f"PDF produced {len(chunks)} chunks."
            )

            if not chunks:

                raise ValueError(
                    "The PDF did not contain any "
                    "extractable text."
                )

            # -----------------------------------------
            # 2. Extract text from chunks
            # -----------------------------------------

            texts = [
                chunk.page_content
                for chunk in chunks
                if chunk.page_content.strip()
            ]

            print(
                f"Valid text chunks: {len(texts)}"
            )

            if not texts:

                raise ValueError(
                    "No usable text was extracted "
                    "from the uploaded PDF."
                )

            # -----------------------------------------
            # 3. Generate embeddings explicitly
            # -----------------------------------------

            print(
                "Generating embeddings for uploaded PDF..."
            )

            embeddings = self.embeddings.embed_documents(
                texts
            )

            print(
                f"Generated {len(embeddings)} embeddings."
            )

            if not embeddings:

                raise ValueError(
                    "The embedding model returned "
                    "no embeddings."
                )

            if len(embeddings) != len(texts):

                raise ValueError(
                    "Number of embeddings does not "
                    "match number of text chunks."
                )

            # -----------------------------------------
            # 4. Create Chroma if necessary
            # -----------------------------------------

            if self.vector_store is None:

                print(
                    "Creating Chroma database..."
                )

                self.vector_store = Chroma(
                 collection_name="pcos_knowledge",
                 persist_directory=self.chroma_path,
                 embedding_function=self.embeddings
                )

            # -----------------------------------------
            # 5. Add documents + embeddings
            # -----------------------------------------

            ids = [
                str(uuid.uuid4())
                for _ in texts
            ]

            metadatas = [
                chunk.metadata
                for chunk in chunks
                if chunk.page_content.strip()
            ]

            self.vector_store.add_texts(
                texts=texts,
                metadatas=metadatas,
                ids=ids,
                embeddings=embeddings
            )

            print(
                "Uploaded PDF successfully added "
                "to Chroma."
            )

            return len(texts)

        except Exception as e:

            print(
                f"ERROR ADDING PDF: {e}"
            )

            raise

    def ask(self, question):

        # -----------------------------------------
        # Make sure a knowledge base exists
        # -----------------------------------------

        if self.vector_store is None:

            return (
                "No knowledge base has been loaded yet."
            )

        try:

            print(
                f"Question received: {question}"
            )

            # -----------------------------------------
            # 1. Retrieve relevant document chunks
            # -----------------------------------------

            retriever = self.vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={
                    "k": 6
                }
            )

            documents = retriever.invoke(
                question
            )

            print(
                f"Retrieved {len(documents)} "
                "document chunks."
            )

            if not documents:

                return (
                    "I couldn't find relevant "
                    "information in the available "
                    "documents."
                )

            # -----------------------------------------
            # 2. Combine retrieved content
            # -----------------------------------------

            context = "\n\n".join(
                document.page_content
                for document in documents
            )

            print(
                "Sending retrieved context to Gemini..."
            )

            # -----------------------------------------
            # 3. Gemini prompt
            # -----------------------------------------

            prompt = f"""
You are a medical information assistant specializing in PCOS.

You have access to trusted PCOS documents provided by the application
and potentially additional documents uploaded by the user.

Answer the user's question using the provided documents.

IMPORTANT:
- Prefer information from the provided documents.
- Do not invent medical facts.
- If the documents do not contain enough information, clearly say so.
- Do not diagnose the user.
- Do not prescribe medication.
- For questions about whether a user personally has PCOS,
  explain that symptoms alone cannot confirm a diagnosis.
- Encourage the user to consult a qualified healthcare professional
  for personal medical decisions.

DOCUMENTS:

{context}

USER QUESTION:

{question}
"""

            # -----------------------------------------
            # 4. Ask Gemini
            # -----------------------------------------

            response = self.llm.invoke(
                prompt
            )

            print(
                "Gemini response received."
            )

            # -----------------------------------------
            # 5. Convert Gemini response to text
            # -----------------------------------------

            content = response.content

            if isinstance(content, str):

                return content

            if isinstance(content, list):

                text_parts = []

                for part in content:

                    if isinstance(part, str):

                        text_parts.append(
                            part
                        )

                    elif isinstance(part, dict):

                        if "text" in part:

                            text_parts.append(
                                str(part["text"])
                            )

                    elif hasattr(part, "text"):

                        text_parts.append(
                            str(part.text)
                        )

                return "\n".join(
                    text_parts
                )

            return str(content)

        except Exception as e:

            print(
                f"ERROR IN RAG: {e}"
            )

            return (
                "Sorry, I couldn't process "
                "your question. "
                f"Error: {str(e)}"
            )