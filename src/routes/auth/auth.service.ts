import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { Prisma } from 'generated/prisma'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDTO, RefreshTokenBodyDTO } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  // Register function
  async register(body: any) {
    try {
      const hashedPassword = await this.hashService.hash(body.password)
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      })
      return user
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Email already exists')
      }
    }
  }
  // Login
  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    })
    if (!user) {
      throw new UnauthorizedException('Account is not exist')
    }
    const isPasswordMatch = await this.hashService.compare(body.password, user.password)
    if (!isPasswordMatch)
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ])

    const tokens = await this.generateTokens({ userId: user.id })
    return tokens
  }
  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt: new Date(decodedRefreshToken.exp),
        userId: payload.userId,
      },
    })
    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      // 1. Check for the valid rf
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      // 2. exists in db
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      })

      //3. xóa rf cũ
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      return await this.generateTokens({ userId })
    } catch (err) {
      //refresh token->thong bao cho user
      //refresh token bi danh cap
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException()
    }
  }
}
