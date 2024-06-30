/**
 * @description the dto used to send an error response to the client
*/
export type ErrorResponse = {
    /**
     * @description the http status code sent to the client. default is 400.
     * @type integer | undefined, int32
    */
    statusCode?: number;
    /**
     * @description the message for the error response
     * @default "One or more errors occurred!"
     * @type string | undefined
    */
    message?: string;
    /**
     * @description the collection of errors for the current context
     * @type object | undefined
    */
    errors?: {
        [key: string]: string[];
    };
};