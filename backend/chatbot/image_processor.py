import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

SUPPORTED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


def extract_text_from_image(image_bytes, mime_type):
    if mime_type not in SUPPORTED_IMAGE_TYPES:
        raise ValueError("Unsupported image format.")

    if not image_bytes:
        raise ValueError("The uploaded image is empty.")

    prompt = """
    Extract all readable information from this medical document image.

    Include:
    - Printed and handwritten text
    - Test names, values, units, and reference ranges
    - Dates and headings
    - Prescription details and medication instructions
    - Relevant table contents

    Preserve the original information as accurately as possible.

    Do not invent missing or unclear information.
    Mark unreadable text as [unclear].

    Return only the extracted document content.
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[
            prompt,
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
        ],
    )

    extracted_text = (response.text or "").strip()

    if not extracted_text:
        raise ValueError(
            "No readable information could be extracted from this image."
        )

    return extracted_text


def image_to_documents(image_bytes, mime_type, filename):
    extracted_text = extract_text_from_image(
        image_bytes=image_bytes,
        mime_type=mime_type,
    )

    document = Document(
        page_content=extracted_text,
        metadata={
            "source": Path(filename).name,
            "file_type": "image",
        },
    )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
    )

    return splitter.split_documents([document])