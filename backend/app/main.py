from fastapi import FastAPI
from app.routes.user_routes import router as user_router
from app.routes.category_routes import router as category_router
from app.routes.expense_routes import router as expense_router
from fastapi.middleware.cors import CORSMiddleware

from app.routes.user_routes import router as user_router
from app.routes.expenses import router as expenses_router
from app.routes.categories import router as categories_router

app = FastAPI(title="Skaidrinam API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

app.include_router(user_router)
app.include_router(category_router)
app.include_router(expenses_router)
app.include_router(categories_router)
app.include_router(expense_router)
