const nameDb = 'myFullStack',
    userName = 'fedunRoman',
    password = 'hRFhnG8kp7XdMt4U',

    linkToDataBase = 'https://cloud.mongodb.com/v2/5ff0f3fcbf15a760de3eb4d6#clusters/pathSelector',
    linkToPostman = 'https://pionierxp.postman.co/workspace/4672f6df-993f-4461-8b53-c6091aae42df/request/create?requestId=c6036095-c237-450b-abda-89fce2f4f2e0',
    linkToTokenEncode = 'https://jwt.io/',
    linkToPassportJwt = 'http://www.passportjs.org/packages/passport-jwt/'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./keys.prod')
} else {
    module.exports = require('./keys.dev')
}
