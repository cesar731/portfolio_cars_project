readme_text = """
# 🚗 Portfolio Cars Project

Proyecto full-stack de un catálogo de autos de lujo con tienda de accesorios, sistema de consultas, galería de usuarios, carrito de compras y panel de administración.

---

## 📁 Estructura del Proyecto

\`\`\`
cesar731-portfolio_cars_project/
├── backend/          # API en FastAPI + SQLAlchemy + PostgreSQL
├── frontend/         # Aplicación en React + TypeScript + Tailwind CSS
├── invoices/         # Facturas generadas (HTML)
└── database_scripts/ # Scripts SQL iniciales
\`\`\`

---

## ⚙️ Requisitos

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL 12+**
- pip, npm

---

## 🐍 Backend (FastAPI)

### 1. Crear entorno virtual
\`\`\`bash
cd backend
python -m venv venv
\`\`\`

### Activar entorno
Linux/macOS:
\`\`\`bash
source venv/bin/activate
\`\`\`

Windows:
\`\`\`powershell
venv\\Scripts\\activate
\`\`\`

### 2. Instalar dependencias
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 3. Variables de entorno (.env)
\`\`\`ini
DATABASE_URL=postgresql://tu_usuario:tu_contraseña@localhost:5432/portfolio_cars_db
SECRET_KEY=tu_clave_secreta_muy_larga_y_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_app
FRONTEND_URL=http://localhost:5173
\`\`\`

### 4. Crear base de datos
\`\`\`sql
CREATE DATABASE portfolio_cars_db;
\`\`\`

### 5. Inicializar DB

#### Opción A: Migraciones
\`\`\`bash
alembic upgrade head
\`\`\`

#### Opción B: Script de ejemplo
\`\`\`bash
python seed_data.py
\`\`\`

### 6. Comandos útiles
Reiniciar contraseña admin:
\`\`\`bash
python reset_admin_password.py
\`\`\`
Probar conexión:
\`\`\`bash
python test_db.py
\`\`\`
Crear roles:
\`\`\`bash
python create_roles.py
\`\`\`

### 7. Iniciar servidor FastAPI
\`\`\`bash
uvicorn main:app --reload --port 8000
\`\`\`

---

## 💻 Frontend

### Instalar dependencias
\`\`\`bash
cd frontend
npm install
\`\`\`

### Ejecutar app
\`\`\`bash
npm run dev
\`\`\`

---

## 🗃️ Base de datos de ejemplo

Restaurar respaldo:
\`\`\`bash
pg_restore -d portfolio_cars_db ruta/al/respaldo.dump
\`\`\`

---

## 🧪 Credenciales de prueba

| Rol | Email | Contraseña |
|-----|--------|------------|
| Admin | cesar@example.com | cesar123 |
| Usuario | admin@portfolio.com | Admin123! |

---

## 📦 Dependencias clave

Backend: FastAPI, SQLAlchemy, Alembic, Passlib, python-jose  
Frontend: React 19, TypeScript, Tailwind CSS, Axios, Formik, React Router v7

---

## 📝 Notas importantes

- Contraseñas truncadas a 72 bytes.
- Frontend usa proxy a http://localhost:8000.
- Facturas generadas en HTML.

---

¿Encontraste un bug? ¡Abre un issue o PR!
"""


desea descargar la base de datos??
este es el link:
https://drive.google.com/drive/folders/1qKAbzpo4_JzUKFznwqmyogCNm2fIHx_7?usp=sharing