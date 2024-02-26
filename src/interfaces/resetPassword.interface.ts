import { z } from "zod";
import { resetPasswordCrateSchema } from "../schemas/resetPassword.schema";

export type TResePasswordRequest = z.infer<typeof resetPasswordCrateSchema>