
exports.up = (knex, Promise) => {
    return knex.schema.createTable('user', (table) => {
        table.increments('id').unsigned().primary()
        table.dateTime('created_at').notNull()
        table.string('first_name').notNull()
        table.string('last_name').notNull()
        table.string('email').notNull()
        table.string('password').notNull()
        table.unique("email")
        table.unique("id")
    })
}

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('user')
}
