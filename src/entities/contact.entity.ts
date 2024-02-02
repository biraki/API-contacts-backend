import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./users.entity";

export enum ContactStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

@Entity("contact")
export class Contact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true, type: "varchar" })
  optionalPhone: string | null | undefined;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, type: "varchar" })
  optionalEmail: string | null | undefined;

  @Column({
    type: "enum",
    enum: ContactStatus,
    default: ContactStatus.ACTIVE,
  })
  status: ContactStatus;

  @CreateDateColumn({ type: "timestamp" })
  registeredAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({ nullable: true, type: "varchar" })
  updatedBy: string | null;

  @ManyToOne(() => User)
  user: User;
}
