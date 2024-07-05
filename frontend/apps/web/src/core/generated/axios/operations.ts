export const operations = {
    'PostLoginUser': {
        'path': '/api/Auth/login',
        'method': 'post'
    },
    'PostCreateUser': {
        'path': '/api/Auth/create',
        'method': 'post'
    },
    'GetUsers': {
        'path': '/api/Users',
        'method': 'get'
    },
    'Test': {
        'path': '/api/Users/test',
        'method': 'get'
    }
} as const