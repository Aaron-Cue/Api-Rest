import fs from "node:fs";
import crypto from "crypto";

const data = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const genreMovies = data.filter((movie) =>
        movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase())
      );
      return genreMovies;
    }
    return data;
  }

  static async getById({ id }) {
    const movie = data.find((movie) => movie.id === id);
    return movie;
  }

  static async create(movie) {
    console.log(movie)
    const newMovie = {
      id: crypto.randomUUID(),
      ...movie,
    };

    if (newMovie) {
      data.push(newMovie);
    }

    return newMovie;
  }

  static async update({ id, input }) {
    // hallar movie por su id
    const movie = data.find((movie) => movie.id === id);

    // error si no existe
    if (!movie) {
      return false;
    }

    // hallar indice de la movie
    const index = data.findIndex((movie) => movie.id === id);

    // actualizar la movie
    data[index] = {
      ...data[index],
      ...input,
    };

    return data[index];
  }

  static async delete({ id }) {
    const index = data.findIndex((movie) => movie.id === id);

    if (index === -1) {
      return false;
    }

    // elimiar
    data.splice(index, 1);
    return true;
  }
}
