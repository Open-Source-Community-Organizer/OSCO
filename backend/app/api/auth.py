from backend.app.models.auth import Account
from backend.app.schemas.auth import (
    AccountRegisterSchema,
    CurrentUserSchema,
    AccountSchema,
    CurrentUserWithJWTSchema,
)
from backend.app.api.dependencies import CurrentSession, CurrentUser
from fastapi import APIRouter

router = APIRouter()


@router.post("/create", response_model=CurrentUserSchema)
async def create_account(
        session: CurrentSession,
        data: AccountRegisterSchema,
) -> CurrentUserSchema:
    created_user = await Account.register(session, data)
    return created_user


@router.get("/get", response_model=CurrentUserSchema)
async def get_account_name(
        session: CurrentSession,  # pylint: disable=unused-argument
        current_user: CurrentUser,
) -> CurrentUserSchema:
    return current_user


@router.post("/login", response_model=CurrentUserWithJWTSchema)
async def user_login(
        session: CurrentSession, data: AccountSchema
) -> CurrentUserWithJWTSchema:
    res = await Account.login(session, data)
    return res