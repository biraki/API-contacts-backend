import { z } from "zod";
import { ContactStatus } from "../entities/contact.entity";

const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  optionalEmail: z.string().email().nullable().or(z.undefined()),
  phone: z.string(),
  optionalPhone: z.string().nullable().or(z.undefined()),
  registeredAt: z.date(),
  status: z.nativeEnum(ContactStatus),
  updatedAt: z.date().nullable(),
  updatedBy: z.string().nullable(),
});

const contactSchemaRequest = contactSchema.omit({
  id: true,
  status: true,
  registeredAt: true,
  updatedAt: true,
  updatedBy: true,
});

const contactSchemaUpdate = contactSchema
  .omit({
    id: true,
  })
  .partial();

const contactsSchemaResponse = z.array(contactSchema);

export {
  contactSchema,
  contactSchemaRequest,
  contactsSchemaResponse,
  contactSchemaUpdate,
};
