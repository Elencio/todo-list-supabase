import React from 'react'
import type { Todo } from "../types"

interface TodoStatsProps {
    todos: Todo[]
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length

    return (
        <div className="text-white">
            {completed} / {total} concluídas
        </div>
    )
}