import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: {
    create: jest.Mock<Promise<User>>;
    save: jest.Mock<Promise<User>>;
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(({ email, password }) =>
        Promise.resolve({
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User),
      ),
      save: jest.fn((user: User) => Promise.resolve(user)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create a new user', async () => {
    const user = await service.create('test@email.com', 'salt.hash');
    expect(user).toBeDefined();
    expect(user.email).toEqual('test@email.com');
  });
});
