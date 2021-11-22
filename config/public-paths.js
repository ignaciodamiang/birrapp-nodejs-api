'use strict';
const publicPaths = {
    get: ['api/home'],
    put: [],
    post: ['api/login','api/check','api/resendConfirmCode' ,
    'api/forgotPassword' ,'api/forgotPassword/confirm' ,'api/register'],
    delete: []
};

function regex(method) {
    const prefix = '^\/';
    const pathRegexStr = prefix + publicPaths[method.toLowerCase()].map((path) => {
        return `(?!${path})`;
    }).join('') + '.*';
    return new RegExp(pathRegexStr, 'i');
}

module.exports = {
    regex
};
