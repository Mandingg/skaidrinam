from fastapi import FastAPI
from app.routes.user_routes import router as user_router
from app.routes.category_routes import router as category_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Skaidrinam API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

app.include_router(user_router)
app.include_router(category_router)
