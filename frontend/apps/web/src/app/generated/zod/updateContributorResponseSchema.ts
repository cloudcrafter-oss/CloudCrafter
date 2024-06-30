import { contributorRecordSchema } from "./contributorRecordSchema";
import { z } from "zod";


export const updateContributorResponseSchema = z.object({ "contributor": z.lazy(() => contributorRecordSchema).optional() });