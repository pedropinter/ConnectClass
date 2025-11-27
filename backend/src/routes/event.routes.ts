import { Router } from "express";
import { EventController } from "../controllers/event.controller";

const router = Router();

router.get("/events/:roomCode", EventController.getByRoom);
router.post("/events", EventController.create);
router.put("/events/:id", EventController.update);
router.delete("/events/:id", EventController.delete);

export default router;
