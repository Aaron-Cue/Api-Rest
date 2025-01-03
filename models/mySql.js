import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

// const config = {
//   host: "localhost",
//   user: "root",
//   port: 3306,
//   database: "moviesdb",
// };

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    try {
      if (genre) {
        // getAll by genre
        // obtener id del genre
        const [genreId] = await connection.query(
          "SELECT id FROM genres WHERE LOWER(name)=LOWER(?)",
          [genre]
        );

        // seleccionar las movies que se relacionen en la tabla movie_genre con el id del genre
        const [moviesResult] = await connection.query(
          "SELECT bin_to_uuid(id) id, title, year, director, duration, poster, rate FROM movies WHERE id IN (SELECT movie_id FROM movie_genres WHERE genre_id=?)",
          [genreId[0].id]
        );

        return moviesResult;
      }
      // not genre -> getAll
      const [moviesResult] = await connection.query(
        "SELECT bin_to_uuid(id) id, title, year, director, duration, poster, rate FROM movies"
      );

      return moviesResult;
    } catch (error) {
      return false;
    }
  }

  static async getById({ id }) {
    try {
      const [result] = await connection.query(
        "SELECT bin_to_uuid(id) id, title, year, director, duration, poster, rate FROM movies WHERE id=UUID_TO_BIN(?)",
        [id]
      );

      return result;
    } catch (err) {
      return false;
    }
  }

  static async create(movie) {
    const { title, year, director, duration, poster, rate, genre } = movie;
    try {
      // add movie to movies table
      await connection.query(
        "INSERT INTO movies (title, year, director, duration, poster, rate) VALUES (?, ?, ?, ?, ?, ?)",
        [title, year, director, duration, poster, rate]
      );

      // get id movie created
      const [movieRes] = await connection.query(
        "SELECT id FROM movies WHERE title=?",
        [title]
      );
      const movieId = movieRes[0].id;

      // for each genre, get id and add relation to movie_genres table
      for (const genreName of genre) {
        const [genreRes] = await connection.query(
          "SELECT id FROM genres WHERE LOWER(name)=LOWER(?)",
          [genreName]
        );
        const genreId = genreRes[0].id;

        await connection.query(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)",
          [movieId, genreId]
        );
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async update({ id, input }) {
    const { title, year, director, duration, poster, rate, genre } = input;

    // actualizar la movie
    const [result] = await connection.query(
      `UPDATE movies SET title = COALESCE(?, title), year = COALESCE(?, year), director = COALESCE(?, director), duration = COALESCE(?, duration), poster = COALESCE(?, poster), rate = COALESCE(?, rate) WHERE id = UUID_TO_BIN(?);`,
      [title, year, director, duration, poster, rate, id]
    ); // COALSCE(1, 2) -> si 1 es null, entonces 2

    // si no se actualizó
    if (result.affectedRows === 0) return false;

    if (genre) {
      // update relations movie_genres
      // delete old relations
      await connection.query(
        "DELETE FROM movie_genres WHERE movie_id=UUID_TO_BIN(?)",
        [id]
      );

      // for each new genre, add relation movie_id - genre_id in to movie_genre
      for (const genreName of genre) {
        const [genreRes] = await connection.query(
          "SELECT id FROM genres WHERE LOWER(name)=LOWER(?)",
          [genreName]
        );
        const genreId = genreRes[0].id;

        await connection.query(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)",
          [id, genreId]
        );
      }
    }

    return true;
  }

  static async delete({ id }) {
    try {
      // delete relation movie_genres
      await connection.query(
        "DELETE FROM movie_genres WHERE movie_id=UUID_TO_BIN(?)",
        [id]
      );
      // delete movie
      await connection.query("DELETE FROM movies WHERE id=UUID_TO_BIN(?)", [
        id,
      ]);

      return true;
    } catch (error) {
      return false;
    }
  }
}
