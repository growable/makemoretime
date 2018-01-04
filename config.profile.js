module.exports = {
    "root":__dirname,
    "dev": {
        isDebug: true,
        env: 'dev',
        mysql:{
            host: '192.168.10.128',
            user: 'root',
            password: '123456',
            database: '',
            port: '3306'
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
            host: '192.168.10.128',
            user: 'root',
            password: '123456',
            database: '',
            port: '3306'
        }
    }
};
