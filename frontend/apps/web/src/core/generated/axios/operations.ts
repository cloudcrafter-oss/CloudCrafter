export const operations = {
    'PostLoginUser': {
        'path': '/api/Auth/login',
        'method': 'post'
    },
    'PostCreateUser': {
        'path': '/api/Auth/create',
        'method': 'post'
    },
    'GetProjects': {
        'path': '/api/Projects',
        'method': 'get'
    },
    'GetServers': {
        'path': '/api/Servers',
        'method': 'get'
    },
    'GetServerById': {
        'path': '/api/Servers/:id',
        'method': 'get'
    },
    'GetFilterableFields': {
        'path': '/api/System/get-fields',
        'method': 'get'
    },
    'GetUsers': {
        'path': '/api/Users',
        'method': 'post'
    },
    'Test': {
        'path': '/api/Users/test',
        'method': 'get'
    }
} as const