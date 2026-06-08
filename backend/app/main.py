from fastapi import FastAPI, Request
import time
from app.routes.user_routes import router as user_router
from app.routes.category_routes import router as category_router
from app.routes.expense_routes import router as expense_router
from app.routes.income_routes import router as income_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_routes
from app.routes.protected_routes import router as protected_routes
from app.routes.categories import router as categories_router
from app.models.log_entry import LogEntryModel
from app.services.log_service import LogService

log_service = LogService()

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
    allow_headers=["*"],
)


@app.middleware("http")
async def audit_logging_middleware(request: Request, call_next):
    response = await call_next(request)
    if request.method in ["POST", "PUT", "DELETE"]:
        user_id = getattr(request.state, "user_id", None)
        path = request.url.path
        table_name = path.split("/")[2]
        last_path_item = path.split("/")[-1]
        item_id = None
        if last_path_item.isdigit():
            item_id = int(last_path_item)
        else:
            second_try = last_path_item.split("=")
            if len(second_try) > 1 and second_try[-1].isdigit():
                item_id = int(second_try[-1])
        status_code = response.status_code
        server_response = f"{status_code}"
        log_entry = LogEntryModel(
            user_id=user_id,
            action_type=request.method,
            record_id=item_id,
            table_name=table_name,
            server_response=server_response,
        )

        log_entry_id = log_service.write_log(log_entry)
        print(f"Sukurtas log entry su ID {log_entry_id}")
        print(log_entry)
        print(f"LOGGING: Kelias: {path} | Metodas: {request.method} | Statusas: {status_code}")

    return response


app.include_router(user_router)
app.include_router(auth_routes)
app.include_router(protected_routes)
app.include_router(category_router)
app.include_router(categories_router)
app.include_router(expense_router)
app.include_router(income_router)
