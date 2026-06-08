from app.services.db_connection import DatabaseManager
from app.models.log_entry import LogEntryModel 
class LogService:
    def __init__(self):
        self.db = DatabaseManager()

    def write_log(self, log_data: LogEntryModel) -> bool:
        """Įrašo logą į duomenų bazę"""
        query = """
            INSERT INTO logs (user_id, action_type, record_id, table_name, server_response)
            VALUES (%s, %s, %s, %s, %s)
        """
        params = (
            log_data.user_id,
            log_data.action_type,
            log_data.record_id,
            log_data.table_name,
            log_data.server_response
        )
        result = self.db.insert(query, params)
        return result