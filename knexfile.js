require("dotenv").config()

module.exports = {
    test: {
        client: 'pg',
       // connection: "postgres://admin:mysecretpassword@0.0.0.0:5433/bookclub-test",
        connection: process.env.PG_CONNECTION_STRING,
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds/test'
        }
    },
    development: {
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING,
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds/development'
        }
    },
    production: {
        client: 'pg',
        connection: {
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            port: process.env.PGPORT
        },
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds/production'
        }
    }
}
