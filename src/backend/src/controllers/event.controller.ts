import { Request, Response } from "express";
import { EventService } from "../services/event.service";

export class EventController {
  static async getByRoom(req: Request, res: Response) {
    const { roomCode } = req.params;
    const events = await EventService.listByRoom(roomCode);
    res.json(events);
  }

  static async create(req: Request, res: Response) {
    const event = await EventService.create(req.body);
    res.json(event);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await EventService.update(id, req.body);
    res.json(updated);
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await EventService.delete(id);
    res.json({ success: true });
  }
}

