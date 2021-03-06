import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Desafios extends BaseSchema {
  protected tableName = 'desafios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('titulo')
      table.integer('pontos')
      table.string('cover')
      table.string('video')
      table.text('conteudo')
      table.dateTime('liberacao')
      table.dateTime('encerramento')
      table.boolean('status').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
