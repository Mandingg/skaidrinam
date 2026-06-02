from fastapi import Header, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt_handler import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Prisijungimo žetonas nepateiktas"
        )

    if token in ("null", "undefined"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Vartotojas neprisijungęs (token yra null/undefined)"
        )

    try:
        payload = verify_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Neteisingas arba pasibaigusio galiojimo žetonas"
            )
        return payload
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Neteisingas arba pasibaigusio galiojimo žetonas"
        )