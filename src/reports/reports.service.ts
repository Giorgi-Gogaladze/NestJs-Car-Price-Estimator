import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) 
        private readonly repo: Repository<Report>
    ){}

    async create(reportDto: CreateReportDto, user: User){
        const report  = this.repo.create(reportDto);
        report.user = user;
        const saved = await this.repo.save(report);
        return this.repo.findOne({
            where: {id: saved.id},
            relations: ['user']
        })
    }

    createEstimate({make, model, lng, lat, year, mileage}: GetEstimateDto){
        return this.repo.createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', {model })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage })
        .limit(3)
        .getRawOne()
    }

    async changeApproval (id: string, approved: boolean, userId: string){
        const report = await this.repo.findOne({where: {
            id: parseInt(id),
            user:{ id: parseInt(userId)}
        }});
        if(!report) {
            throw new NotFoundException('Report not found or not yours');
        }
        report.approved = approved;
        return this.repo.save(report);
    }
    
}
