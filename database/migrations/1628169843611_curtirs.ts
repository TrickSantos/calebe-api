import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Curtirs extends BaseSchema {
  protected tableName = 'curtidas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('cascade')
      table.integer('foto_id').unsigned().references('fotos.id').onDelete('cascade')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
