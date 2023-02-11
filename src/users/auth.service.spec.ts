import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of the users service
    const users: User[] = [];

    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance ot auth service', async () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('creates a new user with a salted and hashed password', async () => {
      const user = await service.signup('daniel@gmail.com', 'asdasdf');

      expect(user.password).not.toEqual('asdasdf');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
      fakeUserService.find = () =>
        Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
      await expect(
        service.signup('daniel@gmail.com', 'asfafa'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signin', () => {
    it('throws an error if signin is called with an unused email', async () => {
      await expect(
        service.signin('danielguve@gmail.com', '233223343'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
      await service.signup('danielguve@gmail.com', '12433435');

      await expect(
        service.signin('danielguve@gmail.com', '06a141605c4c'),
      ).rejects.toThrow(BadRequestException);
    });

    it('return a user if correct password is provided', async () => {
      await service.signup('asasass@gmail.com', 'mypassword');

      const user = await service.signin('asasass@gmail.com', 'mypassword');
      expect(user).toBeDefined();
    });
  });
});
