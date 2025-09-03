from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# --- SeaTable Configuration ---
SEATABLE_API_TOKEN = "313262eba5ae256ea74921ab3067c01a98f99cd7"
SEATABLE_API_URL = "https://cloud.seatable.io/dtable-db/api/v1/rows/"
SEATABLE_TABLE_NAME = "Table1"
# It's better to get the token from environment variables in a real app
# SEATABLE_API_TOKEN = os.environ.get("SEATABLE_API_TOKEN")


# --- Pydantic Models ---
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    message: str

# --- FastAPI App ---
app = FastAPI()
api_router = APIRouter(prefix="/api")


# --- API Endpoints ---
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/contact")
async def submit_contact_form(form_data: ContactForm):
    headers = {
        'Authorization': f'Token {SEATABLE_API_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    payload = {
        'table_name': SEATABLE_TABLE_NAME,
        'row': {
            'Name': form_data.name,
            'Email': form_data.email,
            'Unternehmen': form_data.company,
            'Telefon': form_data.phone,
            'Nachricht': form_data.message,
        }
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(SEATABLE_API_URL, json=payload, headers=headers)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            return {"status": "success", "message": "Form submitted successfully"}
        except httpx.HTTPStatusError as e:
            # SeaTable might return error details in the response body
            error_details = e.response.json()
            logger.error(f"Error from SeaTable API: {error_details}")
            raise HTTPException(status_code=e.response.status_code, detail=error_details)
        except httpx.RequestError as e:
            logger.error(f"Error sending request to SeaTable: {e}")
            raise HTTPException(status_code=500, detail="Failed to connect to SeaTable")


# --- App Configuration ---
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve React App
app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")

@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    return FileResponse('frontend/build/index.html')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
