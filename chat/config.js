module.exports = {
    
    port: process.env.PORT || '9002',
   
    SITE_BASE_URL: 'http://192.168.1.43:9002',
    IMAGE_BASE_DIR: 'http://192.168.1.43:9002/public/images/',
    dbAccess: 'local',
    database:{
        'server':{
            username: "webrtcchat",
            password: "",
            authDb: "admin",
            port: 27017,
            host: "localhost",
            dbName: "webrtcchat"
        },
        'local': {
            port: 27017,
            host: "localhost",
            dbName: "webrtcchat"
        }        
    },
    status: {
        OK: 200,
        CREATED: 201,
        FOUND: 302,
        BAD_REQUEST: 400,
        NOT_AUTHORIZED: 401,
        PAYMENT_REQUERED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        SERVER_ERROR: 500,
        NO_SERVICE: 503
    },
    secret : 'Afv2iPlj0riaT1@soB6rtha-ipEn0iluG9maeI-Tn2Tn9eRe',
    push:{
        IONIC: {
            requestUrl: 'https://api.ionic.io/push/notifications',
            profileName: 'prod',
            apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNDUyNjE5My1lMGEwLTQzNTgtOTg1Zi1kMTE5YzgyYWM3MzcifQ.1fOeJgCYJ1JDgutA7r0YvoSjsgBGfq-Afpd2W41ESsM'   
        },
        FCM: {
            requestUrl: 'https://android.googleapis.com/gcm/send',
            //apiKeyLegacy: 'AIzaSyCjXuy7P5WKOJ7proWAfcj7gdqDtAFJ2Sw',
            apiKey: 'AAAAZQsbkbo:APA91bF6pGQevBEBbMYjQJuGt4_aOqpPx7wDl_O7BeasP6Pqlv9ucsTFoZAyYW1DhHFv7Q7yUWMsSG5yAL8Pwfqes6DyRxbrIfkXTx_nBTZ_GLjiMuASCbbHaT_T6BckxwncrI7TwfNT'
        }        
    },
    pushOpt: 'IONIC'
};