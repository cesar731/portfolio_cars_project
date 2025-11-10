from passlib.hash import bcrypt

# Generar hash de una contraseña
hashed = bcrypt.hash("cesar123")
print(hashed)
# Salida: $2b$10$eJfHjDqVzvQgXkGpZcKw4uYdRmNlPqWtSvXrYzAaBbCcDdEeFfGgHhIiJj