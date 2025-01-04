import React, { useState, useEffect } from 'react'
    import axios from 'axios'
    import './App.css'

    const API_URL = 'http://localhost:8000'

    function App() {
      const [todos, setTodos] = useState([])
      const [newTodo, setNewTodo] = useState('')

      useEffect(() => {
        fetchTodos()
      }, [])

      const fetchTodos = async () => {
        try {
          const response = await axios.get(`${API_URL}/todos`)
          setTodos(JSON.parse(JSON.stringify(response.data)))
        } catch (error) {
          console.error('Error fetching todos:', error)
        }
      }

      const addTodo = async () => {
        if (!newTodo.trim()) return
        try {
          const response = await axios.post(`${API_URL}/todos`, {
            text: newTodo,
            completed: false
          })
          setTodos(prevTodos => [
            ...prevTodos,
            JSON.parse(JSON.stringify(response.data))
          ])
          setNewTodo('')
        } catch (error) {
          console.error('Error adding todo:', error)
        }
      }

      const toggleTodo = async (id) => {
        try {
          const todo = todos.find(t => t.id === id)
          await axios.put(`${API_URL}/todos/${id}`, {
            completed: !todo.completed
          })
          setTodos(prevTodos => prevTodos.map(t => 
            t.id === id ? {...t, completed: !t.completed} : t
          ))
        } catch (error) {
          console.error('Error toggling todo:', error)
        }
      }

      const deleteTodo = async (id) => {
        try {
          await axios.delete(`${API_URL}/todos/${id}`)
          setTodos(prevTodos => prevTodos.filter(t => t.id !== id))
        } catch (error) {
          console.error('Error deleting todo:', error)
        }
      }

      return (
        <div className="container">
          <h1>Todo List</h1>
          <div className="input-container">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
            />
            <button onClick={addTodo}>Add</button>
          </div>
          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <span onClick={() => toggleTodo(todo.id)}>
                  {todo.text}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    export default App
