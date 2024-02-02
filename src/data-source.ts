import 'reflect-metadata'
import 'dotenv/config' 
import { DataSource, DataSourceOptions } from 'typeorm'
import path from 'path'

const dataSourceConfig = (): DataSourceOptions => {
  const entityPath: string = path.join(__dirname, './entities/**.{ts,js}')
  const migrationPath: string = path.join(__dirname, './migrations/**.{ts,js}')


  const dbUrl: string | undefined = process.env.DATABASE_URL

  if(!dbUrl) {
    throw new Error('Missing env: var "DATABASE_URL"')
  }

  return {
    type: "postgres",
    url: dbUrl,
    entities: [entityPath],
    migrations: [migrationPath]
  }
}

export const AppDataSource = new DataSource(dataSourceConfig())