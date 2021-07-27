import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Comentarios extends BaseSchema {
  protected tableName = 'comentarios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('devocional_id').unsigned().references('devocionais.id').onDelete('cascade')
      table.integer('user_id').unsigned().references('users.id').onDelete('cascade')
      table.text('comentario').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
