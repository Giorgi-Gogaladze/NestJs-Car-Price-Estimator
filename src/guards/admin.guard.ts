import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

 export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        if(!request.currentUser){
            throw new ForbiddenException('you must be logged in')
        }
        if(!request.currentUser.admin){
            throw new ForbiddenException('Only admin can change report approval status')
        }
        return true
    }
 }