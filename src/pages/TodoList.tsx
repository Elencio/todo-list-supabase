import React, { useState } from 'react'
import type { Session } from "@supabase/supabase-js"
import { PlusCircle } from 'lucide-react'

// Importações de componentes e hooks
import { useTodoOperations } from '../hooks/useTodoOperations'
import { ErrorAlert } from '../components/ErrorAlert'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { TodoItem } from '../components/TodoItem'
import { TodoStats } from '../components/TodoStats'

export default function TodoList({ session }: { session: Session }) {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearError
  } = useTodoOperations(session)

  // Handler para submit de novo todo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTodoTitle.trim()) return

    setIsSubmitting(true)
    await addTodo(newTodoTitle)
    setNewTodoTitle('')
    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl overflow-hidden border border-indigo-100 transition-all duration-300 hover:shadow-xl">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-5 border-b border-indigo-400 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Minhas Tarefas</h2>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
          <TodoStats todos={todos} />
        </div>
      </div>

      {/* Formulário de Adição */}
      <form onSubmit={handleSubmit} className="p-6 border-b border-indigo-100 bg-indigo-50/50">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Adicione uma nova tarefa"
            className="flex-1 px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newTodoTitle.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium
            disabled:opacity-50 disabled:cursor-not-allowed 
            hover:bg-indigo-700 active:bg-indigo-800 
            transition-all duration-200 shadow-md hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adicionando
              </span>
            ) :
              <span className="flex items-center gap-2">
                <PlusCircle className="h-6 w-6" />
                Adicionando
              </span>}
          </button>
        </div>
      </form>

      {/* Área de Erros */}
      {error && (
        <ErrorAlert
          message={error}
          onClose={clearError}
        />
      )}

      {/* Lista de Tarefas */}
      <div className="p-6 bg-white">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-indigo-700 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500">
              Adicione sua primeira tarefa usando o formulário acima!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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
