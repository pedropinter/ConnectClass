import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Room } from "./Room";

export type LocationType = "001" | "002" | "101" | "102" | "103" | "104";
export type DifficultyType = "other" | "basic" | "relative" | "important";

@Entity("school_events")
export class SchoolEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ name: "start_time", type: "datetime" })
  start!: Date;

  @Column({ name: "end_time", type: "datetime" })
  end!: Date;
  @Column({
    type: "enum",
    enum: ["001", "002", "101", "102", "103", "104"],
    default: "001", // Define um valor padrão
  })
  location!: LocationType;
  @Column({
    type: "enum",
    enum: ["other", "basic", "relative", "important"],
    default: "basic",
  })
  difficulty!: DifficultyType;

  @ManyToOne(() => Room, (room) => room.events, { onDelete: "CASCADE" })
  @JoinColumn({ name: "room_id" })
  room!: Room;

  @Column({ name: "room_id" })
  roomId!: number;
}
