import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  superUser: z.boolean(),
  phone: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  updatedBy: z.string().nullable(),
});

const userSchemaRequest = userSchema.omit({
  id: true,
  createdAt: true,
  registeredAt: true,
  updatedAt: true,
  updatedBy: true,
});

const userSchemaResponse = userSchema.omit({
  password: true,
});

const usersSchemaResponse = z.array(userSchemaResponse);

const userSchemaUpdate = userSchema
  .omit({
    id: true,
  })
  .partial();

export {
  userSchema,
  userSchemaRequest,
  userSchemaResponse,
  usersSchemaResponse,
  userSchemaUpdate
};
