module.exports = {

    development: {

        migrations: { tableName: 'knex_migrations' },
        seeds: { tableName: './seeds' },

        client: 'mysql',
        connection: {

            host: 'localhost',

            user: 'root',
            password: 'aslam@desusa',

            database: 'us_facebook',
            charset: 'utf8',

        }

    }

};