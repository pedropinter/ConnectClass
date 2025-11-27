// backend/src/services/room.service.ts
import { AppDataSource } from "../db/data-source";
import { Room } from "../entities/Room";

export const RoomService = {
  async listAll() {
    return AppDataSource.getRepository(Room).find();
  }
};