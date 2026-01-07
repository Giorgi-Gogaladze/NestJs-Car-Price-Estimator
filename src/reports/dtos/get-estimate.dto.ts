import { Transform, Type } from 'class-transformer';
import { 
    IsString,
    IsNumber,
    Min, 
    Max,
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
  } from 'class-validator'

export class GetEstimateDto {
    @IsNotEmpty()
    @IsString()
    make: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @Transform(({value}) => parseFloat(value))
    @IsNumber()
    @Min(1930)
    @Max( new Date().getFullYear())
    year: number;

    @IsNotEmpty()
    @Transform(({value}) => parseFloat(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @IsNotEmpty()
    @Transform(({value}) => parseFloat(value))
    @IsLongitude()
    @Min(-180)
    @Max(180)
    lng: number;

    @IsNotEmpty()
    @Transform(({value}) => parseFloat(value))
    @IsLatitude()
    @Min(-90)
    @Max(90)
    lat: number;
    
} 