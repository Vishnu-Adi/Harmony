from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from schemas.user import UserSignup
from models import User
from database import db
import uuid
import bcrypt
from datetime import timedelta, datetime
from jose import JWTError, jwt
from passlib.context import CryptContext
import secrets
import uuid
from fastapi import HTTPException
from datetime import timedelta, datetime
from jose import jwt
from dotenv import load_dotenv
import os

router = APIRouter(prefix="/auth", tags=["auth"])

# Security settings
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # You can configure this
SECRET_KEY = os.getenv("SECRET_KEY", "YOUR_SECRET_KEY")
ALGORITHM = "HS256"

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to hash passwords
def hash_password(password: str):
    return pwd_context.hash(password)

# Function to verify passwords
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Function to create access token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup", response_model=User)
async def signup(user: UserSignup):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password before storing
    hashed_password = hash_password(user.password)
    new_user = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password": hashed_password,
        "name": user.name,
        "profile_name": user.profile_name,
    }
    result = await db.users.insert_one(new_user)
    # Generate JWT token
    access_token_data = {"sub": str(new_user["id"])}
    access_token = create_access_token(access_token_data)
    new_user["token"] = access_token
    return new_user

@router.post("/signin")
async def signin(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Generate JWT token
    access_token_data = {"sub": str(user["id"])}
    access_token = create_access_token(access_token_data)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/spotify_register")
async def spotify_register(payload: dict):
    token = payload.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Spotify token is required")

    # Simulate fetching user details from Spotify.
    # In production, replace this code with a call to Spotify's API
    spotify_user = {
        "name": "Spotify User",      # Replace with actual name from Spotify API
        "spotify_id": "abc123"         # Replace with actual Spotify user ID
    }

    # Generate a basic DNA code using secrets (placeholder for your AI/ML code)
    dna_code = secrets.token_hex(8)  # 16-character hex string

    # Create a new user or update existing one with the generated DNA code.
    # For demonstration, we're using a simplified logic. In production, use your DB.
    from database import db  # Ensure you have this import based on your current setup

    existing_user = await db.users.find_one({"spotify_id": spotify_user["spotify_id"]})
    if not existing_user:
        new_user = {
            "id": str(uuid.uuid4()),
            "name": spotify_user["name"],
            "spotify_id": spotify_user["spotify_id"],
            "dna": dna_code,
        }
        await db.users.insert_one(new_user)
        user = new_user
    else:
        await db.users.update_one(
            {"_id": existing_user["_id"]},
            {"$set": {"dna": dna_code}}
        )
        existing_user["dna"] = dna_code
        user = existing_user

    # Generate a JWT token for the authenticated user.
    access_token = create_access_token({"sub": user["id"]})
    return {"user_token": access_token}