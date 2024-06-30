import { z } from "zod";


export const createContributorResponseSchema = z.object({ "id": z.number().optional(), "name": z.string().optional() });