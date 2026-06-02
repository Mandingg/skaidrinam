from fastapi import Header, HTTPException, status
from app.auth.jwt_handler import verify_token

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Prisijungimo žetonas nepateiktas"
        )

    try:
        token_type, token = authorization.split(" ")
        
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

        payload = verify_token(token)
        return payload
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Blogas Authorization antraštės formatas"
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Neteisingas arba pasibaigusio galiojimo žetonas"
        )