import { useState, useEffect, useCallback } from 'react'
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../services/supabaseClient"
import type { Todo } from "../types"

export const useTodoOperations = (session: Session) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os todos
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("inserted_at", { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  // Adicionar novo todo
  const addTodo = useCallback(async (title: string) => {
    if (!title.trim()) return

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([{
          user_id: session.user.id,
          title: title.trim(),
          completed: false,
        }])
        .select()

      if (error) throw error
      setTodos(prevTodos => [data![0], ...prevTodos])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar tarefa')
    }
  }, [session.user.id])

  // Alternar status de conclusão
  const toggleTodo = useCallback(async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ 
          completed: !completed, 
          updated_at: new Date() 
        })
        .eq("id", id)

      if (error) throw error

      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa')
    }
  }, [])

  // Deletar todo
  const deleteTodo = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)

      if (error) throw error
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir tarefa')
    }
  }, [])

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Efeito para buscar todos ao montar
  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearError
  }
}