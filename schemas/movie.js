import z from "zod";

const movieSchema = z.object({
  // props a validar. [si se le pasa una prop que no este aqui, la ignorara]
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(2),
  year: z.number().min(1800).max(2030),
  director: z.string().min(2),
  duration: z.number().min(1).max(600),
  poster: z.string().url(),
  genre: z
    .array(
      z.enum(
        [
          "action",
          "adventure",
          "comedy",
          "drama",
          "romance",
          "animation",
          "crime",
          "sci-fi",
          "biography",
          "fantasy",
        ],
        {
          required_error: "Movie genre is required.",
          invalid_type_error: "Invalid genre",
        }
      )
    )
    .nonempty(),
  rate: z.number().min(0).max(10),
});

export function validateMovie(movie) {
  return movieSchema.safeParse(movie); // devuelve un objeto con un atributo "data" que contiene el objeto validado y un atributo "error" que contiene el error si no se pudo validar
  // para ser valido debe tener todas las props del schema y que cumplan con las validaciones
}

export function validatePartialMovie(movie) {
  return movieSchema.partial().safeParse(movie); // con partial, para ser valido no es necesario que tenga todas las props del schema
}
