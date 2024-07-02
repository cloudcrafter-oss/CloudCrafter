import { postLoginUserMutationRequestSchema, postLoginUserMutationResponseSchema } from './postLoginUserSchema'
import { postCreateUserMutationRequestSchema, postCreateUserMutationResponseSchema } from './postCreateUserSchema'
import { getUsersQueryResponseSchema, getUsersQueryParamsSchema } from './getUsersSchema'
import { testQueryResponseSchema } from './testSchema'

 export const operations = { 'PostLoginUser': {
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
    }, 'PostCreateUser': {
        request: postCreateUserMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: postCreateUserMutationResponseSchema,
            default: postCreateUserMutationResponseSchema
        },
        errors: {}
    }, 'GetUsers': {
        request: undefined,
        parameters: {
            path: undefined,
            query: getUsersQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getUsersQueryResponseSchema,
            default: getUsersQueryResponseSchema
        },
        errors: {}
    }, 'Test': {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: testQueryResponseSchema,
            default: testQueryResponseSchema
        },
        errors: {}
    } } as const
export const paths = { '/api/Auth/login': {
        post: operations['PostLoginUser']
    }, '/api/Auth/create': {
        post: operations['PostCreateUser']
    }, '/api/Users': {
        get: operations['GetUsers']
    }, '/api/Users/test': {
        get: operations['Test']
    } } as const