from fastapi import Header, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt_handler import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

# def get_current_user(token: str = Depends(oauth2_scheme)):
#     if not token:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, 
#             detail="Prisijungimo žetonas nepateiktas"
#         )

#     if token in ("null", "undefined"):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, 
#             detail="Vartotojas neprisijungęs (token yra null/undefined)"
#         )

#     try:
#         payload = verify_token(token)
#         if not payload:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, 
#                 detail="Neteisingas arba pasibaigusio galiojimo žetonas"
#             )
#         return payload
        
#     except Exception:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, 
#             detail="Neteisingas arba pasibaigusio galiojimo žetonas"
#         )
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
                detail="Vartotojas neprisijungęs"
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