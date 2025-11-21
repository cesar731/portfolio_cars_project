"""add reset_token and reset_expires to users

Revision ID: f969faf0e38a
Revises: dffc46488173
Create Date: 2025-11-19 21:15:13.561601

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f969faf0e38a'
down_revision: Union[str, Sequence[str], None] = 'dffc46488173'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('reset_token', sa.String(), nullable=True, unique=True))
    op.add_column('users', sa.Column('reset_expires', sa.DateTime(), nullable=True))
    op.create_index(op.f('ix_users_reset_token'), 'users', ['reset_token'], unique=True)

def downgrade() -> None:
    op.drop_index(op.f('ix_users_reset_token'), table_name='users')
    op.drop_column('users', 'reset_expires')
    op.drop_column('users', 'reset_token')