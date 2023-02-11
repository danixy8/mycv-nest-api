import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id: 1,
          email: 'daniel@gmail.com',
          password: 'asfafa',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email: 'daniel@gmail.com', password: 'asfafa' } as User,
        ]);
      },
      // remove: () => {},
      // updated: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('returns a list of users with the given email', async () => {
      const users = await controller.findAllUsers('daniel@gmail.com');
      expect(users.length).toEqual(1);
      expect(users[0].email).toEqual('daniel@gmail.com');
    });
  });

  describe('findUser', () => {
    it('returns a single user with the given id', async () => {
      const user = await controller.findUser('1');
      expect(user).toBeDefined();
    });

    it('throws an error if user with given id is not found', async () => {
      fakeUsersService.findOne = () => null;
      await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('signin', () => {
    it('updates session object and returns user', async () => {
      const session = { userId: -10 };
      const user = await controller.signin(
        {
          email: 'daniel@gmail.com',
          password: 'asfafa',
        },
        session,
      );

      expect(user.id).toEqual(1);
      expect(session.userId).toEqual(1);
    });
  });
});
