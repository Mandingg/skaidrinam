from fastapi import Header, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt_handler import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:from fastapi import Header, HTTPException, status
from app.auth.jwt_handler import verify_token

def get_current_user(authorization: str = Header(None)):
    # 1. Jei antraštės išvis nėra, metam aiškią 401 klaidą (ne 422)
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Prisijungimo žetonas nepateiktas"
        )

    try:
        # Tikimės formato: "Bearer eyJhbGci..."
        token_type, token = authorization.split(" ")
        
        # Saugiklis: jei React'as atsiuntė žodį "null" kaip tekstą
        if token == "null" or token == "undefined":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Vartotojas neprisijungęs (token yra null)"
            )

        if token_type.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Neteisingas žetono tipas"
            )
            
        # 2. Iškoduojame žetoną
        payload = verify_token(token)
        return payload
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Neteisingas arba pasibaigusio galiojimo žetonas"
        )
        raise HTTPException(status_code=401, detail="No token provided")

    try:
        payload = verify_token(token)
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token or token expired")