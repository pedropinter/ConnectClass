import { Router } from "express";
import { RoomController } from "../controllers/room.controller";

const router = Router();

router.get("/rooms", RoomController.listAll);

export default router;