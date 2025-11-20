# backend/utils/email.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_verification_code_email(to_email: str, code: int):
    sender = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    print(f"📧 Enviando correo de verificación desde: {sender}")

    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = to_email
    msg["Subject"] = "Verifica tu cuenta - Viaggio Velogge"
    body = f"Tu código de verificación es: {code}"
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender, password)
            server.sendmail(sender, to_email, msg.as_string())
        print(f"✅ Correo de verificación enviado a {to_email}")
    except Exception as e:
        print(f"❌ ERROR al enviar correo de verificación a {to_email}: {e}")
        raise


def send_password_reset_code_email(email: str, code: int):
    sender = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    print(f"📧 Enviando correo de restablecimiento desde: {sender}")

    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = email
    msg["Subject"] = "Código de restablecimiento - Portfolio de Autos"

    body = f"""
    Hola,

    Has solicitado restablecer tu contraseña.

    Usa el siguiente código en la aplicación:
    
    {code}
    
    Este código expira en 10 minutos.

    Si no solicitaste este cambio, ignora este mensaje.
    """
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender, password)
            server.sendmail(sender, email, msg.as_string())
        print(f"✅ Correo de restablecimiento enviado a {email}")
    except Exception as e:
        print(f"❌ ERROR al enviar correo de restablecimiento a {email}: {e}")
        raise