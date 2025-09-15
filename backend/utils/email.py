 
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_confirmation_email(email: str, user_id: int):
    msg = MIMEMultipart()
    msg['From'] = os.getenv("EMAIL_USER")
    msg['To'] = email
    msg['Subject'] = "Confirma tu cuenta - Portfolio de Autos"

    body = f"""
    ¡Hola! Gracias por registrarte.

    Haz clic en el siguiente enlace para confirmar tu cuenta:
    {os.getenv("FRONTEND_URL")}/confirm-email?token={user_id}

    Este enlace expira en 24 horas.
    """

    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT")))
    server.starttls()
    server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
    text = msg.as_string()
    server.sendmail(os.getenv("EMAIL_USER"), email, text)
    server.quit()