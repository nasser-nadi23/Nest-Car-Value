import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // if email is already exist
    const users = await this.usersService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('user is already exist');
    }

    // hash password
    const hash = (await scrypt(password, 'advcc', 32)) as Buffer;

    const user = await this.usersService.create(email, hash.toString());

    return user;
  }
}
