'use strict';
const publicPaths = {
    get: ['home'],
    put: [],
    post: ['login','check','resendConfirmCode' ,
    'forgotPassword' ,'forgotPassword/confirm' ,'register'],
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
