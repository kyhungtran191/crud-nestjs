import { Exclude, Expose } from 'class-transformer'
import { IsString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class LoginBodyDTO {
  @IsString()
  email: string
  @IsString()
  @Length(6, 20, {
    message: 'Password should be 6 - 20 characters',
  })
  password: string
}

export class LoginResDTO {
  accessToken: string
  refreshToken: string

  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string
  @IsString()
  @Match('password', {
    message: 'Confirm password is not match',
  })
  confirmPassword: string
}

export class RegisterResDTO {
  id: number
  email: string
  name: string

  @Exclude() password: string
  createdAt: Date
  updateAt: Date

  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial)
  }
}

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {}
