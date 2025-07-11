//Check exist env or not
import fs from 'fs'
import path from 'path'
import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import dotenv from 'dotenv'

// Life cycle Nestjs
dotenv.config()
// Check exist file env or not
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Not found find .env')
  process.exit(1)
}

class ConfigSchema {
  DATABASE_URL: string
  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
  @IsString()
  API_X_KEY: string
}
//convert Object to class
const configServer = plainToInstance(ConfigSchema, process.env)
//Validate all fields
const e = validateSync(configServer)
if (e.length > 0) {
  const errors = e.map((error) => {
    return {
      property: error.property,
      constraints: error.constraints,
      value: error.value,
    }
  })
  throw errors
}

const envConfig = configServer

export default envConfig
