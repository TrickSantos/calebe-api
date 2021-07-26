import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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

  @column.dateTime()
  public liberacao: DateTime

  @column.dateTime()
  public encerramento: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
