module.exports = {
    "root":__dirname,
    "dev": {
        isDebug: true,
        env: 'dev',
        mysql:{
            host: '',
            user: '',
            password: '',
            database: '',
            port: ''
        }
    },
    "fat": {
        isDebug: true,
        env: 'fat',
        mysql:{
            host: '',
            user: '',
            password: '',
            database: '',
            port: ''
        }
    },
    "prod": {
        isDebug: false,
        env: 'pro',
        mysql:{
            host: '',
            user: '',
            password: '',
            database: '',
            port: ''
        }
    }
};
