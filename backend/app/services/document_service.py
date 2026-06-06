import os
from fastapi import UploadFile
from app.services.db_connection import DatabaseManager

class DocumentService:
    """
    Service layer for handling document-related operations.
    This class provides methods for uploading documents and retrieving document information from the database.
    """

    ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}  # Allowed file extensions for upload
    UPLOAD_DIR = "uploads/documents"  # Directory to store uploaded documents

    def __init__(self):
        self.db = DatabaseManager()
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)  # Ensure upload directory exists

    def _validate_file(self, file: UploadFile):
        filename = file.filename

        if not filename or "." not in filename:
            raise ValueError("Failas neturi tinkamo formato.")

        extension = filename.split(".")[-1].lower()

        if extension not in self.ALLOWED_EXTENSIONS:
            raise ValueError("Leidžiami formatai: PDF, JPG, PNG.")

        return extension

    def get_user_documents(self, user_id: int):
        query = """
        SELECT id, user_id, title, file_path, file_type, valid_until, created_at, updated_at
        FROM documents
        WHERE user_id = %s
        ORDER BY created_at DESC
        """

        return self.db.fetch_all(query, (user_id,))
    
    def create_document(self, user_id: int, title: str, valid_until, file: UploadFile):
        title = title.strip()

        if not title:
            raise ValueError("Dokumento pavadinimas negali būti tuščias")
        
        extension = self._validate_file(file)

        insert_query = """
        INSERT INTO documents (user_id, title, file_path, file_type, valid_untill)
        VALUES (%s, %s, %s, %s, %s)
        """

        document_id = self.db.insert(
            insert_query,
            (
                user_id,
                title,
                "pending",
                extension,
                valid_until
            )
        )

        file_name = f"user_{user_id}_document_{document_id}.{extension}"
        file_path = os.path.join(self.UPLOAD_DIR, file_name)

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        update_query = """
        UPDATE documents
        SET file_path = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s AND user_id = %s
        """

        self.db.update(
            update_query,
            (
                file_path,
                document_id,
                user_id
            )
        )

        return {
            "id": document_id,
            "message": "Dokumentas sėkmingai pridėtas"
        }