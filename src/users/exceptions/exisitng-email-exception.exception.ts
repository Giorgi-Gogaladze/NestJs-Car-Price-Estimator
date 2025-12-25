import { HttpException, HttpStatus } from "@nestjs/common";

export class ExistingEmailException extends HttpException{
    constructor(email: string){
        super(
                `User with the email ${email} already exists`,
                HttpStatus.CONFLICT,
        );
    }
}