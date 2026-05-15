from pydantic import BaseModel
from uuid import UUID
from pydantic_extra_types.color import Color


class CategoryCreate(BaseModel):
    name: str
    color: Color


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    color: Color

    class Config:
        from_attributes = True
