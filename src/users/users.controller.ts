import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseInterceptors, Session, } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ){}

    @UseInterceptors(CacheInterceptor)
    @Get('/all')
    getAllUsers(){
        return this.usersService.getAllUsers();
    }
    
    @UseInterceptors(CacheInterceptor)
    @Get()
    public findAllusers(@Query('email') email: string){
        return this.usersService.find(email)
    }

    /* @Get('/whoami')
    async whoAmI(@Session() session: any){
        const user = await this.usersService.findOne(session.userId);
        if(!user){
            throw new BadRequestException("User doesn't exist!")
        }
        return user;
    } */

    @Get('/whoami')
    whoAmI(@CurrentUser() user: User){
        return user;
    }
    
    @Post('/signup')
    public async createUser(@Body() body: CreateUserDto, @Session() session: any){
       const user = await this.authService.sigup(body.email, body.password);
       session.userId = user.id;
       return user;
    }

    @Post('/signin')
    public async signin(@Body() body: CreateUserDto, @Session() session: any){
       const user = await this.authService.signin(body.email, body.password);
       session.userId = user.id;
       return user;
    }
    
    @Post('/signout')
    logout(@Session() session: any){
        session.userId = null;
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
    @UseInterceptors(CacheInterceptor)
    @Get('/:id')
    public async findUser(@Param('id') id: string){
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) throw new NotFoundException(`User with the id of ${id} does not exist!`);
        return user;
    }
    
}
