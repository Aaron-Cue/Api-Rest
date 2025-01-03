import express from 'express'
import MovieRouter from '../routes/movies.js'
import cors from 'cors'

const app = express()
app.disable('x-powered-by') 

const PORT = process.env.PORT || 1234

app.use(express.json())
app.use(cors())
app.use('/movies', MovieRouter)

app.get('/', (req, res) => {
  res.send('inicio, api en /movies')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
