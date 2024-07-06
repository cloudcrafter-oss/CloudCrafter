export const operations = {
    'PostLoginUser': {
        'path': '/api/Auth/login',
        'method': 'post'
    },
    'PostCreateUser': {
        'path': '/api/Auth/create',
        'method': 'post'
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