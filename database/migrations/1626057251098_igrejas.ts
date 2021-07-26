import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Igrejas extends BaseSchema {
  protected tableName = 'igrejas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('distrito_id').unsigned().references('distritos.id')
      table.string('nome')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
