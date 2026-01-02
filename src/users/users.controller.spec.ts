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

  it('creates a user and sets session userId', async () => {
    const user = {id: 10, email: 'a@gmail.com'} as User;
     
    (fakeAuthService.signup as jest.Mock).mockResolvedValue(user);

    const session = {userId: null};

    const result = await controller.createUser(
      {email: 'a@gmail.com', password: 'password'},
      session,
    )

    expect(fakeAuthService.signup).toHaveBeenCalledWith('a@gmail.com', 'password');
    expect(session.userId).toEqual(10);
    expect(result).toEqual(user);
  })

  it('signs in the user and sets session userId', async() => {
    const user = {id:1, email: 'gio@gmail.com'} as User;
    
    (fakeAuthService.signin as jest.Mock).mockResolvedValue(user);

    const session = {userId: null};

    const result = await controller.signin(
      {email: 'gio@gmail.com', password: 'password'},
      session,
    )

    expect(fakeAuthService.signin).toHaveBeenCalledWith('gio@gmail.com', 'password');
    expect(session.userId).toEqual(1);
    expect(result).toEqual(user);
  })

  it('logs out the user and  removes session userId', () => {
    const session = {userId: 1};

    const result = controller.logout(session);

    expect(session.userId).toBeNull();
    expect(result).toEqual('signed out');
  })

  it('returns user with id', async() => {
    const user = {id: 5, email: 'gio@gmail.com'} as User;

    (fakeUsersService.findOne as jest.Mock).mockResolvedValueOnce(user);

    const result = await controller.findUser('5');

    expect(fakeUsersService.findOne).toHaveBeenCalledWith(5);
    expect(result).toEqual(user);
  })

  it('updates the user', async () => {
    const updatedUser  = {id: 3, email:'updated@gmail.com'} as User;
    
    (fakeUsersService.update as jest.Mock).mockResolvedValue(updatedUser);

    const body = {email: 'updated@gmail.com', password: 'newpassword'};

    const result  = await controller.updateUser(`3`, body);

    expect(fakeUsersService.update).toHaveBeenCalledWith(3, body);
    expect(result).toEqual(updatedUser)
  })


  it('removes a user', async () => {
    (fakeUsersService.remove as jest.Mock).mockResolvedValue({success: true});

    const result = await controller.removeUser('4');

    expect(fakeUsersService.remove).toHaveBeenCalledWith(4);
    expect(result).toEqual({success: true});  
  })

});
