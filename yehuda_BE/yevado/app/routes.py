from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .database import SessionLocal
from .models import Machine
from .schemas import MachineCreate, MachineUpdate, MachineRead, MachineSchema
from fastapi.responses import JSONResponse



router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/machine/create/", response_model=MachineRead, summary="Create a new machine")
def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):
    db_machine = Machine(**machine.dict())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine  


@router.put("/machine/update/{machine_id}/", response_model=str, summary= "Update a machine", description="The id of the machine to update")
def update_machine(
    machine_id: int, machine: MachineUpdate, db: Session = Depends(get_db)
):
    db_machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if db_machine:
        for attr, value in machine.dict(exclude_unset=True).items():
            setattr(db_machine, attr, value)
        db.commit()
        db.refresh(db_machine)
        return "Machine updated successfully" 
    else:
        return  "Machine not found"


@router.get("/machine/get/{machine_id}/", response_model=MachineRead, summary= "get a machine")
def read_machine(machine_id: int, db: Session = Depends(get_db)):
    db_machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if db_machine:
        return db_machine
    else:
        return {"error": "Machine not found"}


@router.get("/machines/", response_model=List[MachineRead])
def list_machines(db: Session = Depends(get_db)):
    machines = db.query(Machine).all()
    return machines


# def get_json_schema(method: str):
#     if method == "create":
#         return MachineCreate.schema_json(indent=2) 
#     elif method == "update":
#         return MachineUpdate.schema_json(indent=2) 

#     return JSONResponse(
#         content={"error": "Invalid method"},
#         status_code=400,
#         media_type="application/json"
#     )


# @router.get("/machine/schema/{method}", response_model=dict)
# def get_json_schema_route(method: MachineSchema):
#     return get_json_schema(method)

def get_json_schema(method: str):
    if method == "create":
        return MachineCreate.schema_json(indent=2)
    elif method == "update":
        return MachineUpdate.schema_json(indent=2)

    return JSONResponse(
        content={"error": "Invalid method"},
        status_code=400,
        media_type="application/json"
    )

@router.get("/machine/schema/{method}", response_description="Get the JSON schema for create/update, see below")
def get_json_schema_route(method: MachineSchema):
    return JSONResponse(get_json_schema(method), media_type="application/json")
