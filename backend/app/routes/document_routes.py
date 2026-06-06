from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from datetime import date

from app.auth.dependencies import get_current_user
from app.services.user_service import UserService
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["documents"])

document_service = DocumentService()
user_service = UserService()


def get_logged_user_id(payload):
    user = user_service._get_user_by_email(payload["sub"])

    if not user:
        raise HTTPException(status_code=401, detail="Vartotojas nerastas.")

    return user.id


@router.get("/")
def get_documents(payload=Depends(get_current_user)):
    user_id = get_logged_user_id(payload)
    return document_service.get_user_documents(user_id)


@router.post("/")
def create_document(
    title: str = Form(...),
    valid_until: date | None = Form(None),
    file: UploadFile = File(...),
    payload=Depends(get_current_user)
):
    try:
        user_id = get_logged_user_id(payload)
        return document_service.create_document(user_id, title, valid_until, file)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))