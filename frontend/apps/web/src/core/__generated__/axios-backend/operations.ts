export const operations = {
    "PostCreateDeployment": {
        "path": "/api/Applications/:applicationId/deployment",
        "method": "post"
    },
    "PostLoginUser": {
        "path": "/api/Auth/login",
        "method": "post"
    },
    "PostCreateUser": {
        "path": "/api/Auth/create",
        "method": "post"
    },
    "GetProjects": {
        "path": "/api/Projects",
        "method": "get"
    },
    "CreateProject": {
        "path": "/api/Projects",
        "method": "post"
    },
    "GetProject": {
        "path": "/api/Projects/:id",
        "method": "get"
    },
    "UpdateProject": {
        "path": "/api/Projects/:id",
        "method": "post"
    },
    "DeleteProject": {
        "path": "/api/Projects/:id",
        "method": "delete"
    },
    "GetProjectEnvironmentEnhanced": {
        "path": "/api/Projects/:id/:environmentId",
        "method": "get"
    },
    "GetProviders": {
        "path": "/api/Providers",
        "method": "get"
    },
    "PostCreateGithubApp": {
        "path": "/api/Providers/github",
        "method": "post"
    },
    "GetServers": {
        "path": "/api/Servers",
        "method": "get"
    },
    "GetServerById": {
        "path": "/api/Servers/:id",
        "method": "get"
    },
    "PostCreateStack": {
        "path": "/api/Stacks",
        "method": "post"
    },
    "GetStackDetail": {
        "path": "/api/Stacks/:id",
        "method": "get"
    },
    "UpdateStack": {
        "path": "/api/Stacks/:id",
        "method": "put"
    },
    "GetDeploymentsForStack": {
        "path": "/api/Stacks/:id/deployments",
        "method": "get"
    },
    "GetDeploymentLogs": {
        "path": "/api/Stacks/deployments/:deploymentId/logs",
        "method": "get"
    },
    "DispatchStackDeployment": {
        "path": "/api/Stacks/:id/deploy",
        "method": "post"
    },
    "GetFilterableFields": {
        "path": "/api/System/get-fields",
        "method": "get"
    },
    "GetUsers": {
        "path": "/api/Users",
        "method": "post"
    },
    "Test": {
        "path": "/api/Users/test",
        "method": "get"
    },
    "PostValidateGithubRepo": {
        "path": "/api/Utils/validate-git-repository",
        "method": "post"
    }
} as const;