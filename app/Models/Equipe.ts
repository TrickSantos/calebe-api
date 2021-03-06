import { DateTime } from 'luxon'
import {
  afterFetch,
  BaseModel,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
  HasOne,
  hasOne,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Igreja from './Igreja'
import Resposta from './Resposta'
import Foto from './Foto'

export default class Equipe extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'igrejaId' })
  public igrejaId: number

  @column()
  public nome: string

  @column()
  public instagram: string

  @column()
  public avatar: string

  @hasMany(() => User)
  public membros: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Igreja)
  public igreja: BelongsTo<typeof Igreja>

  @hasOne(() => Resposta)
  public resposta: HasOne<typeof Resposta>

  @hasMany(() => Resposta)
  public respostas: HasMany<typeof Resposta>

  @hasManyThrough([() => Foto, () => User])
  public fotos: HasManyThrough<typeof Foto>

  @computed()
  public get pontos() {
    let pontuacao: number = this.$extras.pontuacao
    return pontuacao
  }

  @afterFetch()
  public static pontuacao(equipes: Equipe[]) {
    equipes.forEach((equipe) => {
      equipe.$extras.pontuacao = equipe.$extras.pontuacao ? equipe.$extras.pontuacao : 0
    })
  }

  @beforeFind()
  public static withPontuacao(query: ModelQueryBuilderContract<typeof Equipe>) {
    query.withAggregate('respostas', (builder) => {
      builder.sum('pontos').as('pontuacao')
    })
  }
}
