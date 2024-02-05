import { z } from "zod"
import { userSchema, userSchemaRecoverPassword, userSchemaRequest, userSchemaResponse, userSchemaUpdate, usersSchemaResponse } from "../schemas/user.schema"
import { DeepPartial } from "typeorm"

type TUserRequest = z.infer<typeof userSchemaRequest>
type TUser = z.infer<typeof userSchema>
type TUserResponse = z.infer<typeof userSchemaResponse>
type TUsersResponse = z.infer<typeof usersSchemaResponse>
type TUserUpdateRequest = DeepPartial<TUserRequest>
type TUserRecoveryPasswordRequest = z.infer<typeof userSchemaRecoverPassword>

export { TUser, TUserRequest, TUserResponse, TUsersResponse, TUserUpdateRequest, TUserRecoveryPasswordRequest }