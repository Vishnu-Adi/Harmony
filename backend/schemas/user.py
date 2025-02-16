from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str
    profile_name: str

class UserSignin(BaseModel):
    email: EmailStr
    password: str