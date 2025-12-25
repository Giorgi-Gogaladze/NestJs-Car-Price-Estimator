import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ExistingEmailException } from './exceptions/exisitng-email-exception.exception';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>
    ){}

    async getAllUsers(): Promise<User[]>{
        return await this.repo.find();
    }

    async create(email:  string, password: string): Promise<User>{
        const existingEmail = await this.findByEmail(email);

        if(existingEmail){
            throw new ExistingEmailException(email);
        }
        const user = this.repo.create({email, password})
        return this.repo.save(user)
    }

    async findOne(id: number): Promise<User | null>{
        const user = await this.repo.findOne({where: {id}});
        return user;
    }

    async find(email: string): Promise<User[]>{
        const users = this.repo.find({where: {email}})
        if(!users){
            throw new NotFoundException(`user with the email: ${email} does  not exist!`)
        }
        return users;
    }

    async update(id: number, attrs: Partial<User>): Promise<User>{
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number){
        const user = await this.findOne(id);
        if(!user) throw new NotFoundException(`User with the id: ${id} does not exist`);
        return this.repo.remove(user)
    }

    async findByEmail(email: string): Promise<User | null>{
        return await this.repo.findOne({where: {email}})
    }

}
