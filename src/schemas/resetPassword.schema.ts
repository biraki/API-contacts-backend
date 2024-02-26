import { z } from "zod";
import { userSchemaResponse } from "./user.schema";

const resetPasswordSchema = z.object({
  id: z.string(),
  token: z.string(),
  user: userSchemaResponse
});

export const resetPasswordCrateSchema = resetPasswordSchema.omit({id: true})