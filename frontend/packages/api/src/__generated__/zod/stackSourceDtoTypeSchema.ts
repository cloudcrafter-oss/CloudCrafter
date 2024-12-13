import { z } from "zod";

 export const stackSourceDtoTypeSchema = z.enum(["Git", "GithubApp"]);