"""add reset_code and reset_expires to users

Revision ID: ac6cbd751c83
Revises: c1bea25becb5
Create Date: 2025-11-20 18:00:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'ac6cbd751c83'  # ✅ DEBE COINCIDIR CON EL NOMBRE DEL ARCHIVO
down_revision: Union[str, Sequence[str], None] = 'c1bea25becb5'  # ✅ La migración anterior
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('users', sa.Column('reset_code', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('reset_expires', sa.DateTime(), nullable=True))
    op.create_index(op.f('ix_users_reset_code'), 'users', ['reset_code'], unique=True)

def downgrade() -> None:
    op.drop_index(op.f('ix_users_reset_code'), table_name='users')
    op.drop_column('users', 'reset_expires')
    op.drop_column('users', 'reset_code')