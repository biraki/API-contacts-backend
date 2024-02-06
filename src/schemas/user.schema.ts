import { z } from "zod";
import { contactSchema } from "./contact.schema";

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
  contacts: z.array(contactSchema)
});

const userSchemaRequest = userSchema.omit({
  id: true,
  createdAt: true,
  registeredAt: true,
  updatedAt: true,
  updatedBy: true,
  contacts:true
});

const userSchemaResponse = userSchema.omit({
  password: true,
});

const usersSchemaResponse = z.array(userSchemaResponse);

const userSchemaUpdate = userSchema
  .omit({
    id: true,
    contacts: true,
    superUser: true,
    createdAt: true,
    updatedAt: true,
    updatedBy: true,
  })
  .partial();

  const userSchemaUpdateResponse = userSchema.omit({
      contacts: true,
    })



  const userSchemaRecoverPassword = userSchema.omit({
    id: true,
    password: true,
    superUser: true,
    phone: true,
    createdAt: true,
    updatedAt: true,
    updatedBy: true
  })

export {
  userSchema,
  userSchemaRequest,
  userSchemaResponse,
  usersSchemaResponse,
  userSchemaUpdate,
  userSchemaRecoverPassword,
  userSchemaUpdateResponse
};
