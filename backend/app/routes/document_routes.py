from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from datetime import date

from app.auth.dependencies import get_current_user
from app.services.document_service import DocumentService
from app.models.document import DocumentUpdateModel

router = APIRouter(prefix="/documents", tags=["documents"])

document_service = DocumentService()


def get_logged_user_id(payload=Depends(get_current_user)):
    try:
        return int(payload["sub"])

    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Vartotojas nerastas."
        )


@router.get("/")
def get_documents(user_id: int = Depends(get_logged_user_id)):
    try:
        return document_service.get_user_documents(user_id)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
    

@router.get("/{document_id}")
def get_document(document_id: int, user_id: int = Depends(get_logged_user_id),):
    try:
        return document_service.get_document(
            document_id,
             user_id
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/")
def create_document(
    title: str = Form(...),
    store_name: str | None = Form(None),
    purchase_date: date | None = Form(None),
    valid_until: date | None = Form(None),
    file: UploadFile = File(...),
    user_id: int = Depends(get_logged_user_id)
):
    try:
        return document_service.create_document(
            user_id,
            title,
            store_name,
            purchase_date,
            valid_until,
            file
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.put("/{document_id}")
def update_document(
    document_id: int,
    document: DocumentUpdateModel,
    user_id: int = Depends(get_logged_user_id)
):
    try:
        return document_service.update_document(document_id, user_id, document)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
    
@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    user_id: int = Depends(get_logged_user_id)
):
    try:
        return document_service.delete_document(
            document_id,
            user_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
