import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';

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
    
}
