import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @UseInterceptors(CacheInterceptor)
    @UseInterceptors(SerializeInterceptor)
    @Get('/all')
    getAllUsers(){
        return this.usersService.getAllUsers();
    }
    
    @UseInterceptors(SerializeInterceptor)
    @UseInterceptors(CacheInterceptor)
    @Get()
    public findAllusers(@Query('email') email: string){
        return this.usersService.find(email)
    }

    @UseInterceptors(SerializeInterceptor)
    @UseInterceptors(CacheInterceptor)
    @Get('/:id')
    public async findUser(@Param('id') id: string){
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) throw new NotFoundException(`User with the id of ${id} does not exist!`);
        return user;
    }

    @Post('/signup')
    public  createUser(@Body() body: CreateUserDto){
       return this.usersService.create(body.email, body.password)
    }


    @Delete('/:id')
    public removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    public updateUser
    (
        @Param('id') id: string,
        @Body() body: UpdateUserDto
    ){
        return this.usersService.update(parseInt(id),body);
    }

}
