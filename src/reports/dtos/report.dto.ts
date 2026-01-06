import { Expose, Transform, } from "class-transformer";

export class ReportDto {
    @Expose()
    id:number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    mileage: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Transform(({obj}) => obj.user?.id ?? obj.userId )
    @Expose()
    userId: number;
}