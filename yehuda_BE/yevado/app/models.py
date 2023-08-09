from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base
from .database import engine

Base = declarative_base()


class MachineStatus(str, Enum):
    active = "active"
    not_active = "not_active"


class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(10))
    location = Column(String)
    email = Column(String)
    number = Column(Integer)
    float_number = Column(Float)
    enum = Column(String, CheckConstraint("enum IN ('active', 'not_active')"))
    created_at = Column(DateTime, default=datetime.now())
    edited_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())
    password = Column(String)


# Create the database tables
Base.metadata.create_all(bind=engine)
