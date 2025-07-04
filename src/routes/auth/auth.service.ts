import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from 'generated/prisma'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly hashService: HashingService, private readonly prismaService: PrismaService) {}
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
}
