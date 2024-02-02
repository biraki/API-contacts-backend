import { z } from "zod"
import { contactSchema, contactSchemaRequest, contactSchemaUpdate, contactsSchemaResponse } from "../schemas/contact.schema"
import { DeepPartial } from "typeorm"

type TContactRequest = z.infer<typeof contactSchemaRequest>
type TContact = z.infer<typeof contactSchema>
type TContactsResponse = z.infer<typeof contactsSchemaResponse>
type TContactUpdateRequest = DeepPartial<TContactRequest>

export { TContact, TContactRequest, TContactsResponse, TContactUpdateRequest }