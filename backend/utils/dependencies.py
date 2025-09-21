from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.models import users as models_users
from backend.utils.security import decode_access_token

# Definir la URL donde los usuarios obtienen el token (login endpoint)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Dependencia que obtiene el usuario actual desde el JWT.
    Si el token es inválido o el usuario no existe, lanza un error 401.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        if payload is None:
            raise credentials_exception
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Buscar el usuario en la base de datos
    user = db.query(models_users.User).filter(models_users.User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user
