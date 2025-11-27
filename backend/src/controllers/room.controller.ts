import { Request, Response } from "express";
import { RoomService } from "../services/room.service";

export const RoomController = {
  async listAll(_req: Request, res: Response) {
    try {
      const rooms = await RoomService.listAll();
      return res.json(rooms);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar salas." });
    }
  }
};