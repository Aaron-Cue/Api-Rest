import express from "express";
import { MovieController } from "../controllers/movies.js";

// import data from "../movies.json" assert { type: "json" }    --> no funcionara en versiones posteriores

import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

const router = express.Router();

// obtener todas las movies
router.get("/", MovieController.getAll);

// obtener movie por id
router.get("/:id", MovieController.getById);

// crear movie
router.post("/", MovieController.create);

// actualizar parte de una movie
router.patch("/:id", MovieController.updatePartial);

// actualizar movie completa
router.put("/:id", MovieController.update);

// eliminar movie
router.delete("/:id", MovieController.delete);

export default router;
