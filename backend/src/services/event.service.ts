import { AppDataSource } from "../db/data-source";
import { SchoolEvent } from "../entities/SchoolEvent";

export const EventService = {
  async listByRoom(roomCode: string) {
    return AppDataSource.getRepository(SchoolEvent)
      .createQueryBuilder("event")
      .innerJoin("event.room", "room")
      .where("room.code = :code", { code: roomCode })
      .getMany();
  },

  async create(eventData: any) {
    const repo = AppDataSource.getRepository(SchoolEvent);
    const event = repo.create(eventData);
    return repo.save(event);
  },

  async update(id: number, data: any) {
    const repo = AppDataSource.getRepository(SchoolEvent);
    await repo.update(id, data);
    return repo.findOneBy({ id });
  },

  async delete(id: number) {
    const repo = AppDataSource.getRepository(SchoolEvent);
    return repo.delete(id);
  },
};
