import React from 'react'
import { Trash2, CheckCircle2, Circle } from "lucide-react"
import type { Todo } from "../types"

interface TodoItemProps {
    todo: Todo
    onToggle: (id: number, completed: boolean) => void
    onDelete: (id: number) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
    todo,
    onToggle,
    onDelete
}) => (
    <div
        className={`flex items-center justify-between p-3 rounded-lg 
      ${todo.completed
                ? 'bg-gray-100 text-gray-500'
                : 'bg-white hover:bg-indigo-50'}`}
    >
        <div className="flex items-center space-x-3 flex-1">
            <button
                onClick={() => onToggle(todo.id, todo.completed)}
                className="focus:outline-none"
            >
                {todo.completed ? (
                    <CheckCircle2 className="text-green-500" />
                ) : (
                    <Circle className="text-gray-300" />
                )}
            </button>
            <span
                className={todo.completed ? 'line-through text-gray-900' : 'text-gray-900'}
            >
                {todo.title}
            </span>
        </div>
        <button
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
        >
            <Trash2 />
        </button>
    </div>
)