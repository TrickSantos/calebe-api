import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Equipes extends BaseSchema {
  protected tableName = 'equipes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('igreja_id').unsigned().references('igrejas.id')
      table.string('nome').unique()
      table.string('instagram').unique()
      table.string('avatar')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
