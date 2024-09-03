import { postCreateDeploymentMutationResponseSchema, postCreateDeploymentPathParamsSchema } from "./postCreateDeploymentSchema";
import { postLoginUserMutationRequestSchema, postLoginUserMutationResponseSchema } from "./postLoginUserSchema";
import { postCreateUserMutationRequestSchema, postCreateUserMutationResponseSchema } from "./postCreateUserSchema";
import { postRefreshTokensMutationRequestSchema, postRefreshTokensMutationResponseSchema } from "./postRefreshTokensSchema";
import { getProjectsQueryResponseSchema, getProjectsQueryParamsSchema } from "./getProjectsSchema";
import { createProjectMutationRequestSchema, createProjectMutationResponseSchema } from "./createProjectSchema";
import { getProjectQueryResponseSchema, getProject404Schema, getProjectPathParamsSchema } from "./getProjectSchema";
import { updateProjectMutationRequestSchema, updateProjectMutationResponseSchema, updateProjectPathParamsSchema } from "./updateProjectSchema";
import { deleteProjectMutationResponseSchema, deleteProjectPathParamsSchema } from "./deleteProjectSchema";
import { getProjectEnvironmentEnhancedQueryResponseSchema, getProjectEnvironmentEnhanced404Schema, getProjectEnvironmentEnhancedPathParamsSchema } from "./getProjectEnvironmentEnhancedSchema";
import { getServersQueryResponseSchema } from "./getServersSchema";
import { getServerByIdQueryResponseSchema, getServerByIdPathParamsSchema } from "./getServerByIdSchema";
import { postCreateStackMutationRequestSchema, postCreateStackMutationResponseSchema } from "./postCreateStackSchema";
import { getStackDetailQueryResponseSchema, getStackDetail404Schema, getStackDetailPathParamsSchema } from "./getStackDetailSchema";
import { getFilterableFieldsQueryResponseSchema } from "./getFilterableFieldsSchema";
import { getTestMutationRequestSchema, getTestMutationResponseSchema } from "./getTestSchema";
import { getUsersMutationRequestSchema, getUsersMutationResponseSchema } from "./getUsersSchema";
import { testQueryResponseSchema } from "./testSchema";
import { postValidateGithubRepoMutationRequestSchema, postValidateGithubRepoMutationResponseSchema } from "./postValidateGithubRepoSchema";

 export const operations = { "PostCreateDeployment": {
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
    }, "PostLoginUser": {
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
    }, "PostCreateUser": {
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
    }, "PostRefreshTokens": {
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
    }, "GetProjects": {
        request: undefined,
        parameters: {
            path: undefined,
            query: getProjectsQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getProjectsQueryResponseSchema,
            default: getProjectsQueryResponseSchema
        },
        errors: {}
    }, "CreateProject": {
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
    }, "GetProject": {
        request: undefined,
        parameters: {
            path: getProjectPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getProjectQueryResponseSchema,
            404: getProject404Schema,
            default: getProjectQueryResponseSchema
        },
        errors: {
            404: getProject404Schema
        }
    }, "UpdateProject": {
        request: updateProjectMutationRequestSchema,
        parameters: {
            path: updateProjectPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateProjectMutationResponseSchema,
            default: updateProjectMutationResponseSchema
        },
        errors: {}
    }, "DeleteProject": {
        request: undefined,
        parameters: {
            path: deleteProjectPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteProjectMutationResponseSchema,
            default: deleteProjectMutationResponseSchema
        },
        errors: {}
    }, "GetProjectEnvironmentEnhanced": {
        request: undefined,
        parameters: {
            path: getProjectEnvironmentEnhancedPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getProjectEnvironmentEnhancedQueryResponseSchema,
            404: getProjectEnvironmentEnhanced404Schema,
            default: getProjectEnvironmentEnhancedQueryResponseSchema
        },
        errors: {
            404: getProjectEnvironmentEnhanced404Schema
        }
    }, "GetServers": {
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
    }, "GetServerById": {
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
    }, "PostCreateStack": {
        request: postCreateStackMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: postCreateStackMutationResponseSchema,
            default: postCreateStackMutationResponseSchema
        },
        errors: {}
    }, "GetStackDetail": {
        request: undefined,
        parameters: {
            path: getStackDetailPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getStackDetailQueryResponseSchema,
            404: getStackDetail404Schema,
            default: getStackDetailQueryResponseSchema
        },
        errors: {
            404: getStackDetail404Schema
        }
    }, "GetFilterableFields": {
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
    }, "GetTest": {
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
    }, "GetUsers": {
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
    }, "Test": {
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
    }, "PostValidateGithubRepo": {
        request: postValidateGithubRepoMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: postValidateGithubRepoMutationResponseSchema,
            default: postValidateGithubRepoMutationResponseSchema
        },
        errors: {}
    } } as const;
export const paths = { "/api/Applications/{applicationId}/deployment": {
        post: operations["PostCreateDeployment"]
    }, "/api/Auth/login": {
        post: operations["PostLoginUser"]
    }, "/api/Auth/create": {
        post: operations["PostCreateUser"]
    }, "/api/Auth/refresh": {
        post: operations["PostRefreshTokens"]
    }, "/api/Projects": {
        get: operations["GetProjects"],
        post: operations["CreateProject"]
    }, "/api/Projects/{id}": {
        get: operations["GetProject"],
        post: operations["UpdateProject"],
        delete: operations["DeleteProject"]
    }, "/api/Projects/{id}/{environmentId}": {
        get: operations["GetProjectEnvironmentEnhanced"]
    }, "/api/Servers": {
        get: operations["GetServers"]
    }, "/api/Servers/{id}": {
        get: operations["GetServerById"]
    }, "/api/Stacks": {
        post: operations["PostCreateStack"]
    }, "/api/Stacks/{id}": {
        get: operations["GetStackDetail"]
    }, "/api/System/get-fields": {
        get: operations["GetFilterableFields"]
    }, "/api/Test": {
        post: operations["GetTest"]
    }, "/api/Users": {
        post: operations["GetUsers"]
    }, "/api/Users/test": {
        get: operations["Test"]
    }, "/api/Utils/validate-git-repository": {
        post: operations["PostValidateGithubRepo"]
    } } as const;