import { z } from "zod";


export const contributorRecordSchema = z.object({ "id": z.number().optional(), "name": z.string().optional(), "phoneNumber": z.string().nullable().nullish() });