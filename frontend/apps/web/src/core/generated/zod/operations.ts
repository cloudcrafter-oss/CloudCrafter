import { postLoginUserMutationRequestSchema, postLoginUserMutationResponseSchema } from './postLoginUserSchema'
import { postCreateUserMutationRequestSchema, postCreateUserMutationResponseSchema } from './postCreateUserSchema'
import { postRefreshTokensMutationRequestSchema, postRefreshTokensMutationResponseSchema } from './postRefreshTokensSchema'
import { getServersQueryResponseSchema } from './getServersSchema'
import { getFilterableFieldsQueryResponseSchema } from './getFilterableFieldsSchema'
import { getUsersMutationRequestSchema, getUsersMutationResponseSchema } from './getUsersSchema'
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
    }, 'PostRefreshTokens': {
        request: postRefreshTokensMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: postRefreshTokensMutationResponseSchema,
            default: postRefreshTokensMutationResponseSchema
        },
        errors: {}
    }, 'GetServers': {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getServersQueryResponseSchema,
            default: getServersQueryResponseSchema
        },
        errors: {}
    }, 'GetFilterableFields': {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getFilterableFieldsQueryResponseSchema,
            default: getFilterableFieldsQueryResponseSchema
        },
        errors: {}
    }, 'GetUsers': {
        request: getUsersMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getUsersMutationResponseSchema,
            default: getUsersMutationResponseSchema
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
    }, '/api/Auth/refresh': {
        post: operations['PostRefreshTokens']
    }, '/api/Servers': {
        get: operations['GetServers']
    }, '/api/System/get-fields': {
        get: operations['GetFilterableFields']
    }, '/api/Users': {
        post: operations['GetUsers']
    }, '/api/Users/test': {
        get: operations['Test']
    } } as const