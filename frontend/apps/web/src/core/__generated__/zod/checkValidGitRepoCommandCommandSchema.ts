import { z } from "zod";

 export const checkValidGitRepoCommandCommandSchema = z.object({ "repository": z.string() });