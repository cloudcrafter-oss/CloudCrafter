import { postCreateDeploymentMutationResponseSchema, postCreateDeploymentPathParamsSchema } from './postCreateDeploymentSchema'
import { postLoginUserMutationRequestSchema, postLoginUserMutationResponseSchema } from './postLoginUserSchema'
import { postCreateUserMutationRequestSchema, postCreateUserMutationResponseSchema } from './postCreateUserSchema'
import { postRefreshTokensMutationRequestSchema, postRefreshTokensMutationResponseSchema } from './postRefreshTokensSchema'
import { getProjectsQueryResponseSchema } from './getProjectsSchema'
import { createProjectMutationRequestSchema, createProjectMutationResponseSchema } from './createProjectSchema'
import { patchApiProjectsIdMutationRequestSchema, patchApiProjectsIdMutationResponseSchema, patchApiProjectsIdPathParamsSchema } from './patchApiProjectsIdSchema'
import { getServersQueryResponseSchema } from './getServersSchema'
import { getServerByIdQueryResponseSchema, getServerByIdPathParamsSchema } from './getServerByIdSchema'
import { getFilterableFieldsQueryResponseSchema } from './getFilterableFieldsSchema'
import { getTestMutationRequestSchema, getTestMutationResponseSchema } from './getTestSchema'
import { getUsersMutationRequestSchema, getUsersMutationResponseSchema } from './getUsersSchema'
import { testQueryResponseSchema } from './testSchema'

 export const operations = { 'PostCreateDeployment': {
        request: undefined,
        parameters: {
            path: postCreateDeploymentPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: postCreateDeploymentMutationResponseSchema,
            default: postCreateDeploymentMutationResponseSchema
        },
        errors: {}
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
    }, 'GetProjects': {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getProjectsQueryResponseSchema,
            default: getProjectsQueryResponseSchema
        },
        errors: {}
    }, 'CreateProject': {
        request: createProjectMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: createProjectMutationResponseSchema,
            default: createProjectMutationResponseSchema
        },
        errors: {}
    }, 'patch_api-projects-id': {
        request: patchApiProjectsIdMutationRequestSchema,
        parameters: {
            path: patchApiProjectsIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: patchApiProjectsIdMutationResponseSchema,
            default: patchApiProjectsIdMutationResponseSchema
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
    }, 'GetServerById': {
        request: undefined,
        parameters: {
            path: getServerByIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getServerByIdQueryResponseSchema,
            default: getServerByIdQueryResponseSchema
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
    }, 'GetTest': {
        request: getTestMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getTestMutationResponseSchema,
            default: getTestMutationResponseSchema
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
export const paths = { '/api/Applications/{applicationId}/deployment': {
        post: operations['PostCreateDeployment']
    }, '/api/Auth/login': {
        post: operations['PostLoginUser']
    }, '/api/Auth/create': {
        post: operations['PostCreateUser']
    }, '/api/Auth/refresh': {
        post: operations['PostRefreshTokens']
    }, '/api/Projects': {
        get: operations['GetProjects'],
        post: operations['CreateProject']
    }, '/api/Projects/{id}': {
        patch: operations['patch_api-projects-id']
    }, '/api/Servers': {
        get: operations['GetServers']
    }, '/api/Servers/{id}': {
        get: operations['GetServerById']
    }, '/api/System/get-fields': {
        get: operations['GetFilterableFields']
    }, '/api/Test': {
        post: operations['GetTest']
    }, '/api/Users': {
        post: operations['GetUsers']
    }, '/api/Users/test': {
        get: operations['Test']
    } } as const