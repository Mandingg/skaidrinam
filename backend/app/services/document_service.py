import os
from fastapi import UploadFile
from app.services.db_connection import DatabaseManager


class DocumentService:
    """
    Service layer for handling document-related operations.
    This class provides methods for uploading documents and retrieving document information from the database.
    """

    # Allowed file extensions for upload
    ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}
    UPLOAD_DIR = "uploads/documents"  # Directory to store uploaded documents

    def __init__(self):
        self.db = DatabaseManager()
        # Ensure upload directory exists
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)

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
        INSERT INTO documents (user_id, title, file_path, file_type, valid_until)
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

    def update_document(self, document_id: int, user_id: int, document):
        existing_document = self.db.fetch_one(
            """
            SELECT id, title
            FROM documents
            WHERE id = %s and user_id = %s
            """,
            (document_id, user_id)
        )

        if not existing_document:
            raise ValueError("Dokumentas nerastas.")

        update_fields = []
        values = []

        if document.title is not None:
            title = document.title.strip()

            if not title:
                raise ValueError("Dokumento pavadinimas negali būti tuščias.")

            update_fields.append("title = %s")
            values.append(title)

        if document.valid_until is not None:
            update_fields.append("valid_until = %s")
            values.append(document.valid_until)

        if not update_fields:
            raise ValueError("Nėra atnaujinamų duomenų.")

        update_fields.append("updated_at = CURRENT_TIMESTAMP")

        values.extend([document_id, user_id])

        query = f"""
        UPDATE documents
        SET {", ".join(update_fields)}
        WHERE id = %s AND user_id = %s
        """

        self.db.update(query, tuple(values))

        return {
            "message": "Dokumentas sėkmingai atnaujintas."
        }

    def delete_document(self, document_id: int, user_id: int):
        document = self.db.fetch_one(
            """
            SELECT id, file_path
            FROM documents
            WHERE id = %s AND user_id = %s
            """,
            (document_id, user_id)
        )

        if not document:
            raise ValueError("Dokumentas nerastas.")

        deleted_rows = self.db.delete(
            """
            DELETE FROM documents
            WHERE id = %s AND user_id = %s
            """,
            (document_id, user_id)
        )

        if deleted_rows == 0:
            raise ValueError("Dokumento ištrinti nepavyko.")

        if document["file_path"] and os.path.exists(document["file_path"]):
            os.remove(document["file_path"])

        return {
            "message": "Dokumentas sėkmingai ištrintas."
        }
