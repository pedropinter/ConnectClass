import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Room } from "./Room";

@Entity("school_events")
export class SchoolEvent {
  @PrimaryGeneratedColumn()
  id!: number; // agora numérico (Auto Increment)

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
    enum: ["other", "basic", "relative", "important"],
    default: "basic",
  })
  difficulty!: "other" | "basic" | "relative" | "important";

  @ManyToOne(() => Room, (room) => room.events, { onDelete: "CASCADE" })
  @JoinColumn({ name: "room_id" })
  room!: Room;

  @Column({ name: "room_id" })
  roomId!: number;
}
