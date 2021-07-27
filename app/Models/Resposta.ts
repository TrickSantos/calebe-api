import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Desafio from './Desafio'
import Equipe from './Equipe'

interface Iresposta {
  url: string
}

export default class Resposta extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'desafioId' })
  public desafioId: number

  @column({ serializeAs: 'equipeId' })
  public equipeId: number

  @column()
  public pontos: number

  @column()
  public respostas: Iresposta[]

  @column()
  public aprovado: boolean

  @column.dateTime()
  public aprovado_em: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Desafio)
  public desafio: BelongsTo<typeof Desafio>

  @belongsTo(() => Equipe)
  public equipe: BelongsTo<typeof Equipe>
}
