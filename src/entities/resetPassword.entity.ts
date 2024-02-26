import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "./users.entity";

  @Entity("resetPassword")
  export class ResetPassword {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ unique: true })
    token: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
  }
  