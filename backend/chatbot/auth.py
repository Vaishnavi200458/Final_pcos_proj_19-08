
import os

import httpx
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Please log in to use the chatbot.",
        )

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase authentication is not configured.",
        )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {credentials.credentials}",
                },
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=401,
                detail="Your session is invalid or expired. Please log in again.",
            )

        user_id = response.json().get("id")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Could not identify the logged-in user.",
            )

        return user_id

    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Authentication service is temporarily unavailable.",
        )
