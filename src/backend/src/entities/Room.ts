import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SchoolEvent } from "./SchoolEvent";

@Entity("rooms")
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string; // ex: "room-1"

  @Column()
  label!: string; // ex: "1-AM SENAC"

  @OneToMany(() => SchoolEvent, (event) => event.room)
  events!: SchoolEvent[];
}
