import React, {
    createContext,
    useContext,
    useReducer,
    useCallback
} from 'react'
import type { Todo } from '../types'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../services/supabaseClient'

// Tipos de Ações
type TodoAction =
    | { type: 'FETCH_TODOS', payload: Todo[] }
    | { type: 'ADD_TODO', payload: Todo }
    | { type: 'TOGGLE_TODO', payload: number }
    | { type: 'DELETE_TODO', payload: number }
    | { type: 'SET_ERROR', payload: string }
    | { type: 'CLEAR_ERROR' }

// Estado do Contexto
interface TodoState {
    todos: Todo[]
    error: string | null
    loading: boolean
}

// Tipo do Contexto
interface TodoContextType extends TodoState {
    addTodo: (title: string, session: Session) => Promise<void>
    toggleTodo: (id: number) => Promise<void>
    deleteTodo: (id: number) => Promise<void>
    clearError: () => void
}

// Reducer
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
        case 'FETCH_TODOS':
            return { ...state, todos: action.payload, loading: false }
        case 'ADD_TODO':
            return { ...state, todos: [action.payload, ...state.todos] }
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            }
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

// Contexto
const TodoContext = createContext<TodoContextType | undefined>(undefined)

// Provider
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(todoReducer, {
        todos: [],
        error: null,
        loading: true
    })

    // Operações com tratamento de erros
    const addTodo = useCallback(async (title: string, session: Session) => {
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
            dispatch({ type: 'ADD_TODO', payload: data![0] })
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err instanceof Error ? err.message : 'Erro ao adicionar tarefa'
            })
        }
    }, [])

    const toggleTodo = useCallback(async (id: number) => {
        try {
            const todo = state.todos.find(t => t.id === id)
            if (!todo) return

            const { error } = await supabase
                .from("todos")
                .update({
                    completed: !todo.completed,
                    updated_at: new Date()
                })
                .eq("id", id)

            if (error) throw error
            dispatch({ type: 'TOGGLE_TODO', payload: id })
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err instanceof Error ? err.message : 'Erro ao atualizar tarefa'
            })
        }
    }, [state.todos])

    const deleteTodo = useCallback(async (id: number) => {
        try {
            const { error } = await supabase
                .from("todos")
                .delete()
                .eq("id", id)

            if (error) throw error
            dispatch({ type: 'DELETE_TODO', payload: id })
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err instanceof Error ? err.message : 'Erro ao excluir tarefa'
            })
        }
    }, [])

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' })
    }, [])

    return (
        <TodoContext.Provider value={{
            ...state,
            addTodo,
            toggleTodo,
            deleteTodo,
            clearError
        }}>
            {children}
        </TodoContext.Provider>
    )
}

// Hook personalizado para consumir o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useTodos = () => {
    const context = useContext(TodoContext)
    if (context === undefined) {
        throw new Error('useTodos must be used within a TodoProvider')
    }
    return context
}