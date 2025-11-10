"""add consultation_id to messages

Revision ID: 930c1a9d2c50
Revises: 379c5732d1ee
Create Date: 2025-11-09 17:32:48.369713

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '930c1a9d2c50'
down_revision: Union[str, Sequence[str], None] = '379c5732d1ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Agrega la columna como nullable=True (acepta NULL)
    op.add_column('messages', sa.Column('consultation_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_messages_consultation_id',
        'messages',
        'consultations',
        ['consultation_id'],
        ['id'],
        ondelete='SET NULL'  # o 'CASCADE' si prefieres eliminar mensajes al borrar consulta
    )


def downgrade() -> None:
    op.drop_constraint('fk_messages_consultation_id', 'messages', type_='foreignkey')
    op.drop_column('messages', 'consultation_id')