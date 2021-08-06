import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Resposta from './Resposta'

export default class Desafio extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public titulo: string

  @column()
  public pontos: number

  @column()
  public cover: string

  @column()
  public video: string

  @column()
  public conteudo: string

  @column.date()
  public liberacao: DateTime

  @column.date()
  public encerramento: DateTime

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Resposta)
  public respostas: HasMany<typeof Resposta>
}
