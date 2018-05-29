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
            port: '3306',
            charset: 'utf8mb4'
        }
    },
    "fat": {
        isDebug: true,
        env: 'fat',
        mysql:{
            host: '120.26.219.227',
            user: 'ctriptest',
            password: 'ZyDVLAQq7VJXeQqH',
            database: 'test',
            port: '3306'
        }
    },
    "fws": {
        isDebug: true,
        env: 'fws',
        mysql: {
            host: '127.0.0.1',
            user: 'root',
            password: 'yhdeng123',
            database: '',
            port: '3306'
        }
    },
    "prod": {
        isDebug: false,
        env: 'pro',
        mysql:{
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: '',
            port: '3306'
        }
    }
};
