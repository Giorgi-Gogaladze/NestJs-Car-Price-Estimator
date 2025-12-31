import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

describe("AuthService", () => {

    let service: AuthService;
    let fakeUserService: Partial<UsersService>
    
    beforeEach(async () => {
        fakeUserService = {
            find: () => Promise.resolve([]),
            create: (email:string, password: string) => Promise.resolve({id: 1, email, password} as User) 
        }
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService,
                }
            ]
        }).compile()
    
        service = module.get<AuthService>(AuthService);
    })
    
    it('can create an instance of auth service', async () => {
        
        expect(service).toBeDefined();
    });

    it('creates a new user with salted an hashed password', async () => {
       const user = await service.signup('test@gmail.com', 'testpass');
       expect(user.password).not.toEqual('testpass');
       const [salt, hash] = user.password.split('.');
       expect(salt).toBeDefined();
       expect(hash).toBeDefined();
    })


    it('throws an error if a user  signs up with an email that is alrady in use', async () => {
        fakeUserService.find = () => Promise.resolve([{id: 2, email: "email@gmail.com", password: "1234"} as User]);
        await expect(service.signup('asdf@gmail.com', 'asasa')).rejects.toThrow(BadRequestException)
    })

    it('throws an error if signin is called with an unused email', async ()=> {
        await expect(service.signin('laskdjf@alskdfj.com', 'passowrd')).rejects.toThrow(NotFoundException)
    })

    it('throws if an invalid password is provided', async () => {
        const realpass = 'correctPassword';
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(realpass, salt, 32)) as Buffer;
        const storedPassword = `${salt}.${hash.toString('hex')}`;

        fakeUserService.find = () => Promise.resolve([{email: "email@gmail.com", password: storedPassword} as User]);

        await expect(service.signin('email@gmail.com', 'wrongPassword')).rejects.toThrow(BadRequestException)
    })

    it('returns a user if correct password is provided', async () => {
        const realpass = '123456'
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(realpass, salt, 32)) as Buffer;
        const password = `${salt}.${hash.toString('hex')}`;

        fakeUserService.find = () => Promise.resolve([{email: "email@gmail.com", password} as User]);
        const user = await service.signin('test@gmail.com', 'correct-password');

        expect(user).toBeDefined();
        expect(user.email).toEqual('test@gmail.com')
    })
});

