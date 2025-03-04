import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Recursos de tradução
const resources = {
    pt: {
        translation: {
            todos: {
                title: 'Minhas Tarefas',
                addPlaceholder: 'Adicione uma nova tarefa',
                addButton: 'Adicionar',
                addingButton: 'Adicionando...',
                emptyState: 'Nenhuma tarefa encontrada. Adicione sua primeira tarefa!',
                stats: '{{completed}} / {{total}} concluídas'
            },
            errors: {
                generic: 'Algo deu errado',
                addTodo: 'Erro ao adicionar tarefa',
                updateTodo: 'Erro ao atualizar tarefa',
                deleteTodo: 'Erro ao excluir tarefa'
            }
        }
    },
    en: {
        translation: {
            todos: {
                title: 'My Tasks',
                addPlaceholder: 'Add a new task',
                addButton: 'Add',
                addingButton: 'Adding...',
                emptyState: 'No tasks found. Add your first task!',
                stats: '{{completed}} / {{total}} completed'
            },
            errors: {
                generic: 'Something went wrong',
                addTodo: 'Error adding task',
                updateTodo: 'Error updating task',
                deleteTodo: 'Error deleting task'
            }
        }
    }
}

// Configuração do i18n
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pt', // língua padrão
        fallbackLng: 'en', // língua de fallback
        interpolation: {
            escapeValue: false // react já escapa os valores
        }
    })

import { useTranslation } from 'react-i18next'

export const TodoList = () => {
    const { t, i18n } = useTranslation()

    // Mudar idioma
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    return (
        <div>
            <h1>{t('todos.title')}</h1>
            <input
                placeholder={t('todos.addPlaceholder')}
            />
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('pt')}>Português</button>
        </div>
    )
}