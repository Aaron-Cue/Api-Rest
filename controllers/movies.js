// import { MovieModel } from "../models/json-local.js"; 
import { MovieModel } from "../models/mySql.js";  
// import {MovieModel} from "../models/mongo.js";  


import { validateMovie, validatePartialMovie } from "../schemas/movie.js";

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    if (movies) return res.json(movies);
    res.status(404).json({ error: "Movies not found" });
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (movie) return res.json(movie);
    res.status(404).json({ error: "Movie not found" });
  }

  static async create(req, res) {
    const movie = validateMovie(req.body);

    if (movie.error) {
      return res.status(400).json({ error: movie.error.errors });
    }
    
    const result = await MovieModel.create(movie.data);

    if (result) {
      res.status(201).json({ message: "Movie created" });
    } else {
      res.status(400).json({ error: "Movie not created" });
    }
  }

  static async updatePartial(req, res) {
    const result = validatePartialMovie(req.body);

    if (!result.data) {
      return res.status(400).json({ error: result.error.errors });
    }

    const { id } = req.params;

    const movieUpdate = await MovieModel.update({ id, input: result.data });

    if (movieUpdate) {
      return res.json({ message: "Movie updated" });
    }
    return res.status(404).json({ error: "error update" });
  }

  static async update(req, res) {
    const result = validateMovie(req.body);

    if (result.error) {
      res.status(400).json({ error: result.error.errors });
    }

    const { id } = req.params;

    const movieUpdate = await MovieModel.update({ id, input: result.data });

    if (movieUpdate) {
      return res.json({ message: "Movie updated" });
    }
    return res.status(404).json({ error: "error" });
  }

  static async delete(req, res) {
    const { id } = req.params;

    const result = await MovieModel.delete({ id });

    if (!result) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ message: "Movie deleted" });
  }
}
