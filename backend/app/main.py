from fastapi import FastAPI
from app.routes.user_routes import router as user_router
from app.routes.category_routes import router as category_router
from app.routes.expense_routes import router as expense_router
from app.routes.income_routes import router as income_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_routes
from app.routes.protected_routes import router as protected_routes


from app.routes.categories import router as categories_router

app = FastAPI(title="Skaidrinam API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

app.include_router(user_router)

app.include_router(auth_routes)        
app.include_router(protected_routes)
app.include_router(category_router)
app.include_router(categories_router)
app.include_router(expense_router)
app.include_router(income_router)
