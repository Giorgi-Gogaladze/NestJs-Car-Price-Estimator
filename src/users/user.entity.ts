import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../reports/report.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({default: false})
    admin: boolean;

    @AfterInsert()
    logInserts(){
        console.log('inserted user with id', this.id)
    }

    @AfterUpdate()
    logUpdates(){
        console.log('updated user with id', this.id)
    }

    @AfterRemove()
    logRemove(){
        console.log('removed user with id', this.id)
    }

    @OneToMany(() => Report, report => report.user)
    reports: Report[];

}