import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./db/data-source";
import router from "./routes/event.routes";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Rotas da API devem vir antes
  app.use("/", router);

  // 🔥 Caminho correto para o build Angular
  const angularPath = path.join(__dirname, "../../../dist/angular-example/browser");

  // 🔥 Servir arquivos estáticos do Angular
  app.use(express.static(angularPath));

  // 🔥 Rota fallback para SPA Angular
  app.get("*", (req, res) => {
    res.sendFile(path.join(angularPath, "index.html"));
  });

  app.listen(3000, () => console.log("Backend running on port 3000 🚀"));
});
