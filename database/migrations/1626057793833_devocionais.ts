import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Devocionais extends BaseSchema {
  protected tableName = 'devocionais'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('autor_id').unsigned().references('users.id')
      table.string('titulo')
      table.string('verso')
      table.string('cover')
      table.string('video')
      table.text('conteudo')
      table.dateTime('liberacao')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
