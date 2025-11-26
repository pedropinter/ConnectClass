import "reflect-metadata";
import { DataSource } from "typeorm";
import { Room } from "../entities/Room";
import { SchoolEvent } from "../entities/SchoolEvent";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "connectClass",
  synchronize: false,
  logging: false,
  entities: [Room, SchoolEvent],
});

