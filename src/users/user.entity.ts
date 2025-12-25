import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email: string;

    @Column()
    password: string;

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

}