import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAllUsers: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByEmail: jest.fn(),
          }
        },
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(), 
            signin: jest.fn(),
          },
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    fakeUsersService = module.get<UsersService>(UsersService);
    fakeAuthService = module.get<AuthService>(AuthService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns all users', async () => {
    const users: User[] = [
      {id: 1, email: 'a@gmail.com'} as User,
      {id: 2, email: 'b@gmail.com'} as User,
    ];
    (fakeUsersService.getAllUsers as jest.Mock).mockResolvedValue(users);

    const result  = await controller.getAllUsers();
    expect(fakeUsersService.getAllUsers).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('returns a user with a given email', async () => {
    const users =[{id: 1, email: "test@gmail.com"}] as User[];

    (fakeUsersService.find as jest.Mock).mockResolvedValueOnce(users);
    const result = await controller.findAllusers('test@gmail.com');

    expect(fakeUsersService.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('returns a current user', async() => {
    const user = {id: 1, email: 'giorgi@gmail.com'} as User;

    const result = controller.whoAmI(user);

    expect(result).toEqual(user);
  })

});
