import { cloudCrafterWebContributorsCreateMutationRequestSchema, cloudCrafterWebContributorsCreateMutationResponseSchema, cloudCrafterWebContributorsCreate400Schema } from './cloudCrafterWebContributorsCreateSchema'
import { cloudCrafterWebContributorsListQueryResponseSchema } from './cloudCrafterWebContributorsListSchema'
import { cloudCrafterWebContributorsDeleteMutationResponseSchema, cloudCrafterWebContributorsDelete400Schema, cloudCrafterWebContributorsDeletePathParamsSchema } from './cloudCrafterWebContributorsDeleteSchema'
import { cloudCrafterWebContributorsGetByIdQueryResponseSchema, cloudCrafterWebContributorsGetById400Schema, cloudCrafterWebContributorsGetByIdPathParamsSchema } from './cloudCrafterWebContributorsGetByIdSchema'
import { cloudCrafterWebContributorsUpdateMutationRequestSchema, cloudCrafterWebContributorsUpdateMutationResponseSchema, cloudCrafterWebContributorsUpdate400Schema, cloudCrafterWebContributorsUpdatePathParamsSchema } from './cloudCrafterWebContributorsUpdateSchema'
import { postLoginUserMutationRequestSchema, postLoginUserMutationResponseSchema } from './postLoginUserSchema'

 export const operations = { 'CloudCrafterWebContributorsCreate': {
        request: cloudCrafterWebContributorsCreateMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: cloudCrafterWebContributorsCreateMutationResponseSchema,
            400: cloudCrafterWebContributorsCreate400Schema,
            default: cloudCrafterWebContributorsCreateMutationResponseSchema
        },
        errors: {
            400: cloudCrafterWebContributorsCreate400Schema
        }
    }, 'CloudCrafterWebContributorsList': {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: cloudCrafterWebContributorsListQueryResponseSchema,
            default: cloudCrafterWebContributorsListQueryResponseSchema
        },
        errors: {}
    }, 'CloudCrafterWebContributorsDelete': {
        request: undefined,
        parameters: {
            path: cloudCrafterWebContributorsDeletePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: cloudCrafterWebContributorsDeleteMutationResponseSchema,
            400: cloudCrafterWebContributorsDelete400Schema,
            default: cloudCrafterWebContributorsDeleteMutationResponseSchema
        },
        errors: {
            400: cloudCrafterWebContributorsDelete400Schema
        }
    }, 'CloudCrafterWebContributorsGetById': {
        request: undefined,
        parameters: {
            path: cloudCrafterWebContributorsGetByIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: cloudCrafterWebContributorsGetByIdQueryResponseSchema,
            400: cloudCrafterWebContributorsGetById400Schema,
            default: cloudCrafterWebContributorsGetByIdQueryResponseSchema
        },
        errors: {
            400: cloudCrafterWebContributorsGetById400Schema
        }
    }, 'CloudCrafterWebContributorsUpdate': {
        request: cloudCrafterWebContributorsUpdateMutationRequestSchema,
        parameters: {
            path: cloudCrafterWebContributorsUpdatePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: cloudCrafterWebContributorsUpdateMutationResponseSchema,
            400: cloudCrafterWebContributorsUpdate400Schema,
            default: cloudCrafterWebContributorsUpdateMutationResponseSchema
        },
        errors: {
            400: cloudCrafterWebContributorsUpdate400Schema
        }
    }, 'PostLoginUser': {
        request: postLoginUserMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: postLoginUserMutationResponseSchema,
            default: postLoginUserMutationResponseSchema
        },
        errors: {}
    } } as const
export const paths = { '/Contributors': {
        post: operations['CloudCrafterWebContributorsCreate'],
        get: operations['CloudCrafterWebContributorsList']
    }, '/Contributors/{contributorId}': {
        delete: operations['CloudCrafterWebContributorsDelete'],
        get: operations['CloudCrafterWebContributorsGetById'],
        put: operations['CloudCrafterWebContributorsUpdate']
    }, '/api/Auth': {
        post: operations['PostLoginUser']
    } } as const