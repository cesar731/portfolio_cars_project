"""add reset_token and reset_expires to users

Revision ID: dffc46488173
Revises: 930c1a9d2c50
Create Date: 2025-11-19 21:00:15.552403

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dffc46488173'
down_revision: Union[str, Sequence[str], None] = '930c1a9d2c50'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
