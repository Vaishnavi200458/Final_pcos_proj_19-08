import os
import time
import base64
from groq import Groq
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

    start_time = time.perf_counter()
    extracted_text = None

    # -----------------------------------------
    # 1. Try Groq first
    # -----------------------------------------
    groq_api_key = os.getenv("GROQ_API_KEY")

    if groq_api_key:
        try:
            print("Trying Groq image text extraction...")

            groq_client = Groq(
                api_key=groq_api_key,
                timeout=20.0,
                max_retries=0,
            )

            encoded_image = base64.b64encode(
                image_bytes
            ).decode("utf-8")

            image_url = (
                f"data:{mime_type};base64,{encoded_image}"
            )

            groq_response = (
                groq_client.chat.completions.create(
                    model="qwen/qwen3.8-27b",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": prompt,
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": image_url
                                    },
                                },
                            ],
                        }
                    ],
                    temperature=0,
                )
            )

            extracted_text = (
                groq_response.choices[0].message.content
                or ""
            ).strip()

            if not extracted_text:
                raise ValueError(
                    "Groq returned empty extracted text."
                )

            print("Groq image extraction successful.")

        except Exception as error:
            print(
                "Groq image extraction failed:",
                type(error).__name__,
                str(error),
            )

    # -----------------------------------------
    # 2. Gemini fallback
    # -----------------------------------------
    if not extracted_text:
        try:
            print("Trying Gemini image extraction fallback...")

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

            extracted_text = (
                response.text or ""
            ).strip()

            if not extracted_text:
                raise ValueError(
                    "Gemini returned empty extracted text."
                )

            print("Gemini image extraction successful.")

        except Exception as error:
            print(
                "Gemini image extraction failed:",
                type(error).__name__,
                str(error),
            )

            raise RuntimeError(
                "Image text extraction is temporarily "
                "unavailable. Please try again later."
            ) from error

    extraction_time = (
        time.perf_counter() - start_time
    )

    print(
        f"Image text extraction time: "
        f"{extraction_time:.2f} seconds"
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