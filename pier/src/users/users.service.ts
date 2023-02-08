import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.prismaService.user.findUnique({
      where: { email },
    });

    return user || undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = this.prismaService.user.findUnique({
      where: { username },
    });

    return user || undefined;
  }

  async findById(id: string): Promise<User> {
    const user = this.prismaService.user.findUnique({
      where: { id: Number(id) },
    });

    return user || undefined;
  }

  async createOne({ email, username, password }: { email: string, username: string, password: string }): Promise<User> {
    const user = this.prismaService.user.create({
      data: {
        email,
        username,
        password  // Hash this
      }
    });

    return user
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
