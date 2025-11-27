import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SchoolEvent } from "./SchoolEvent";

@Entity("rooms")
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string; 

  @Column()
  label!: string; 

  @OneToMany(() => SchoolEvent, (event) => event.room)
  events!: SchoolEvent[];
}
