import express from 'express'
    import cors from 'cors'
    import { v4 as uuidv4 } from 'uuid'

    const app = express()
    const port = 8000

    app.use(cors())
    app.use(express.json())

    let todos = []

    app.get('/todos', (req, res) => {
      const safeTodos = todos.map(todo => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed
      }))
      res.json(safeTodos)
    })

    app.post('/todos', (req, res) => {
      const newTodo = {
        id: uuidv4(),
        text: req.body.text,
        completed: req.body.completed || false
      }
      todos.push(newTodo)
      res.status(201).json(JSON.parse(JSON.stringify(newTodo)))
    })

    app.put('/todos/:id', (req, res) => {
      const todo = todos.find(t => t.id === req.params.id)
      if (todo) {
        todo.completed = req.body.completed
        res.json(JSON.parse(JSON.stringify({
          id: todo.id,
          text: todo.text,
          completed: todo.completed
        })))
      } else {
        res.status(404).json({ error: 'Todo not found' })
      }
    })

    app.delete('/todos/:id', (req, res) => {
      const index = todos.findIndex(t => t.id === req.params.id)
      if (index !== -1) {
        todos.splice(index, 1)
        res.status(204).end()
      } else {
        res.status(404).json({ error: 'Todo not found' })
      }
    })

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
