import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>
    ){}

    async create(email:  string, password: string): Promise<User>{
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
            throw new Error('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number){
        const user = await this.findOne(id);
        if(!user) throw new Error(`User with the id: ${id} does not exist`);
        return this.repo.remove(user)
    }
}
