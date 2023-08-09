from datetime import datetime
from pydantic import BaseModel, EmailStr
from enum import Enum


class MachineStatus(str, Enum):
    active = "active"
    not_active = "not_active"

    class Config:
        arbitrary_types_allowed = True


class MachineBase(BaseModel):
    name: str
    location: str
    email: EmailStr
    number: int
    float_number: float
    enum: MachineStatus


class MachineCreate(MachineBase):
    password: str


class MachineUpdate(MachineBase):
    pass


class MachineRead(MachineBase):
    id: int
    created_at: datetime
    edited_at: datetime

    class Config:
        from_attributes = True


class MachineSchema(str, Enum):
    create = "create"
    update = "update"