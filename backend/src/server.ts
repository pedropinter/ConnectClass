import "reflect-metadata"; 
import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./db/data-source";
import router from "./routes/event.routes";
import roomRouter from "./routes/room.routes";
AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/", router);
  app.use("/", roomRouter);

  const angularDistName = "angular-example"; 
  const angularPath = path.join(__dirname, "../../frontend/dist", angularDistName, "browser");

  app.use(express.static(angularPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(angularPath, "index.html"), (err) => {
        if (err) {
            res.status(500).send("Erro: O build do frontend não foi encontrado. Você rodou 'ng build' na pasta frontend?");
        }
    });
  });

  app.listen(3000, () => console.log("Backend running on port 3000 🚀"));
}).catch((error) => console.log("Erro ao conectar no Banco:", error));