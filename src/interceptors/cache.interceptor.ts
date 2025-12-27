import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, of, tap } from "rxjs";

const cacheStore = new Map<string, {data: any, expire: number}>()

export class CacheInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>{
        const request = context.switchToHttp().getRequest();

        if(request.method !== 'GET'){
            return next.handle();
        }
        console.log('request method:',request.method);

        const key = request.url;
        const now = Date.now();

        const cached = cacheStore.get(key);

        if(cached && cached.expire > now){
            console.log(`Returning cached response for ${key}`);
            return of(cached.data);
        }

        return next.handle().pipe(
            tap(response => {
                console.log(`Caching response for ${key}`);
                cacheStore.set(key, {data: response, expire: now + 15000}); //15 წამის ქეში
            })
        )
    }
}