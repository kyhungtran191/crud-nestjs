import { SetMetadata } from '@nestjs/common'
import { AuthTypeType, ConditionGuardType } from '../constants/auth.const'

export const AUTH_TYPE_KEY = 'authType'
export type AuthTypeDecoratorPayload = {
  authTypes: AuthTypeType[]
  options: {
    condition: ConditionGuardType
  }
}
export const Auth = (authTypes: AuthTypeType[], options: { condition: ConditionGuardType }) => {
  //SetMetaData let us create a customer decorator
  return SetMetadata(AUTH_TYPE_KEY, { authTypes, options })
}
