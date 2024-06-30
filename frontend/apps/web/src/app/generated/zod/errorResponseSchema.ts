import { z } from "zod";

 /**
 * @description the dto used to send an error response to the client
 */
export const errorResponseSchema = z.object({ "statusCode": z.number().describe("the http status code sent to the client. default is 400.").optional(), "message": z.string().default("One or more errors occurred!").describe("the message for the error response").optional(), "errors": z.object({}).catchall(z.array(z.string())).describe("the collection of errors for the current context").optional() }).describe("the dto used to send an error response to the client");