import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Respostas extends BaseSchema {
  protected tableName = 'respostas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('desafio_id').unsigned().references('desafios.id').onDelete('cascade')
      table.integer('equipe_id').unsigned().references('equipes.id').onDelete('cascade')
      table.integer('pontos')
      table.json('respostas').notNullable()
      table.boolean('aprovado').defaultTo(false)
      table.dateTime('aprovado_em')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
