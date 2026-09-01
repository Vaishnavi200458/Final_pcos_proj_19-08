# import os

# from chatbot.rag import PCOSRAG


# rag = PCOSRAG()

# folder = os.path.join(
#     os.path.dirname(__file__),
#     "data",
#     "pcos"
# )

# for filename in os.listdir(folder):

#     if filename.lower().endswith(".pdf"):

#         path = os.path.join(
#             folder,
#             filename
#         )

#         print(f"Processing {filename}...")

#         chunks = rag.add_pdf(path)

#         print(
#             f"Added {chunks} chunks"
#         )

# print(
#     "PCOS knowledge base created."
# )

import os

from chatbot.rag import PCOSRAG

rag = PCOSRAG()

folder = os.path.join(
    os.path.dirname(__file__),
    "data",
    "pcos"
)

files_to_process = [
    "pcos4.pdf",
    "pcos5.pdf",
]

for filename in files_to_process:
    path = os.path.join(folder, filename)

    print(f"Processing {filename}...")

    chunks = rag.add_pdf(path)

    print(f"Added {chunks} chunks")

print("Remaining PCOS knowledge base files added.")