# backend/routers/purchases.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend import models
from backend.security.oauth2 import get_current_user
from backend.schemas.purchase import PurchaseCreate, PurchaseOut
from datetime import datetime
import uuid
import os
import pdfkit

router = APIRouter()

# Directorio para facturas
PDF_DIR = "invoices"
os.makedirs(PDF_DIR, exist_ok=True)

def generate_invoice_number() -> str:
    return f"INV-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

@router.post("/checkout", response_model=PurchaseOut)
def checkout(
    purchase_: PurchaseCreate,  # ✅ Corregido: nombre de variable + tipo
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != purchase_.user_id:
        raise HTTPException(status_code=403, detail="No autorizado")

    total = 0.0
    purchase_items = []
    for item in purchase_.items:
        accessory = db.query(models.Accessory).filter(models.Accessory.id == item.accessory_id).first()
        if not accessory or accessory.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para {accessory.name if accessory else 'producto'}"
            )
        total += accessory.price * item.quantity
        purchase_items.append((accessory, item.quantity))

    invoice_num = generate_invoice_number()
    purchase = models.Purchase(
        user_id=current_user.id,
        total_amount=total,
        invoice_number=invoice_num
    )
    db.add(purchase)
    db.flush()

    for accessory, qty in purchase_items:
        db_item = models.PurchaseItem(
            purchase_id=purchase.id,
            accessory_id=accessory.id,
            quantity=qty,
            price_at_purchase=accessory.price
        )
        accessory.stock -= qty
        db.add(db_item)

    db.commit()
    db.refresh(purchase)
    return purchase


@router.get("/{purchase_id}/invoice", response_class=FileResponse)
def download_invoice(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    purchase = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    if purchase.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No autorizado")

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Factura {purchase.invoice_number}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .header h1 {{ color: #0066cc; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            th, td {{ border: 1px solid #ccc; padding: 10px; text-align: left; }}
            .total {{ font-weight: bold; font-size: 1.2em; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>FACTURA</h1>
            <p><strong>Número:</strong> {purchase.invoice_number}</p>
            <p><strong>Fecha:</strong> {purchase.created_at.strftime('%d/%m/%Y %H:%M')}</p>
        </div>
        <p><strong>Cliente:</strong> {current_user.username} ({current_user.email})</p>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    """

    total_general = 0
    for item in purchase.items:
        total_item = item.quantity * item.price_at_purchase
        total_general += total_item
        html_content += f"""
                <tr>
                    <td>{item.accessory.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price_at_purchase:,.2f}</td>
                    <td>${total_item:,.2f}</td>
                </tr>
        """

    html_content += f"""
            </tbody>
        </table>
        <div class="total">Total: ${total_general:,.2f}</div>
        <p>¡Gracias por tu compra!</p>
    </body>
    </html>
    """

    html_path = os.path.join(PDF_DIR, f"{purchase.invoice_number}.html")
    pdf_path = os.path.join(PDF_DIR, f"{purchase.invoice_number}.pdf")

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    pdfkit.from_file(html_path, pdf_path)
    os.remove(html_path)

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"factura_{purchase.invoice_number}.pdf"
    )