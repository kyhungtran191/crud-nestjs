//Check exist env or not
import fs from 'fs'
import path from 'path'
import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Not found find .env')
  process.exit(1)
}

class ConfigSchema {
  DATABASE_URL: string
  @IsString()
  ACCESS_TOKEN_SECRET: string
  ACCESS_TOKEN_EXPIRES_IN: string
  REFRESH_TOKEN_SECRET: string
  REFRESH_TOKEN_EXPIRES_IN: string
}
//convert Object to class
const configServer = plainToInstance(ConfigSchema, process.env)
//
const e = validateSync(configServer)
