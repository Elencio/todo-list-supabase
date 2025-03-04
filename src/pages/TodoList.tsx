import React, { useState } from 'react'
import type { Session } from "@supabase/supabase-js"

import { useTodos } from '../context/TodoContext' // Import the provider and hook
import { ErrorAlert } from '../components/ErrorAlert'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { TodoItem } from '../components/TodoItem'
import { TodoStats } from '../components/TodoStats'



export default function TodoList({ session }: { session: Session }) {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use the useTodos hook instead of a custom hook
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearError
  } = useTodos()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTodoTitle.trim()) return

    setIsSubmitting(true)
    // Pass the session to addTodo
    await addTodo(newTodoTitle, session)
    setNewTodoTitle('')
    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-600">Minhas Tarefas</h2>
        <TodoStats todos={todos} />
      </div>

      <form onSubmit={handleSubmit} className="p-6 border-b">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Adicione uma nova tarefa"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newTodoTitle.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md 
            disabled:opacity-50 disabled:cursor-not-allowed 
            hover:bg-indigo-700 transition-colors"
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </form>

      {error && (
        <ErrorAlert
          message={error}
          onClose={clearError}
        />
      )}

      <div className="p-6">
        {loading ? (
          <LoadingSpinner />
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhuma tarefa encontrada. Adicione sua primeira tarefa!
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}