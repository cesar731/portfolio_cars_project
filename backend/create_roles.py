from database.database import SessionLocal, engine, Base
from models.role import Role

Base.metadata.create_all(bind=engine)

db = SessionLocal()

roles = [
    Role(id=1, name="admin"),
    Role(id=2, name="asesor"),
    Role(id=3, name="usuario"),
]

for role in roles:
    exists = db.query(Role).filter(Role.id == role.id).first()
    if not exists:
        db.add(role)

db.commit()
db.close()
print("Roles creados o ya existentes.")