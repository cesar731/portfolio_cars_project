"""add verify_code and verify_expires to users

Revision ID: 38ada5917ef2
Revises: ac6cbd751c83
Create Date: 2025-11-19 23:22:36.762804

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '38ada5917ef2'
down_revision: Union[str, Sequence[str], None] = 'ac6cbd751c83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('verify_code', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('verify_expires', sa.DateTime(), nullable=True))

def downgrade() -> None:
    op.drop_column('users', 'verify_expires')
    op.drop_column('users', 'verify_code')