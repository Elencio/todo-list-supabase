import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../pages/TodoList';
import { supabase } from '../services/supabaseClient';
import type { Session } from "@supabase/supabase-js";

// Mock Supabase more comprehensively
jest.mock('../supabaseClient', () => ({
    supabase: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({
            data: [],
            error: null
        }),
        insert: jest.fn().mockResolvedValue({
            data: [{ id: '1', title: 'Nova tarefa de teste', is_complete: false }],
            error: null
        }),
        update: jest.fn().mockResolvedValue({
            data: [{ id: '1', is_complete: true }],
            error: null
        }),
        delete: jest.fn().mockResolvedValue({
            data: null,
            error: null
        }),
        order: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
    }
}));

// Mock session
const mockSession: Session = {
    user: {
        id: 'test-user-id',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        confirmed_at: '',
        created_at: '',
        email: 'test@example.com',
        email_confirmed_at: '',
        last_sign_in_at: '',
        phone: '',
        role: '',
        updated_at: ''
    },
    expires_at: 0,
    expires_in: 0,
    token_type: '',
    access_token: '',
    refresh_token: ''
};

describe('TodoList Component', () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test rendering empty todo list
    test('renderiza lista de tarefas vazia', async () => {
        // Mock empty todo list
        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: [], error: null }),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis()
        });

        render(<TodoList session={mockSession} />);

        await waitFor(() => {
            expect(screen.getByText(/Nenhuma tarefa encontrada/i)).toBeInTheDocument();
        });
    });

    // Test adding a new todo
    test('adiciona nova tarefa', async () => {
        // Mock todo insertion
        (supabase.from as jest.Mock).mockReturnValue({
            insert: jest.fn().mockResolvedValue({
                data: [{ id: '1', title: 'Nova tarefa de teste', is_complete: false }],
                error: null
            }),
            select: jest.fn().mockResolvedValue({
                data: [{ id: '1', title: 'Nova tarefa de teste', is_complete: false }],
                error: null
            }),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis()
        });

        render(<TodoList session={mockSession} />);

        const input = screen.getByPlaceholderText(/Adicione uma nova tarefa/i);
        const addButton = screen.getByText(/Adicionar/i);

        fireEvent.change(input, { target: { value: 'Nova tarefa de teste' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('todos');
            expect(screen.getByText('Nova tarefa de teste')).toBeInTheDocument();
        });
    });

    // Test completing a todo
    test('marca tarefa como concluída', async () => {
        // Mock todo with initial state
        const mockTodos = [{
            id: '1',
            title: 'Tarefa de teste',
            is_complete: false,
            user_id: 'test-user-id'
        }];

        // Mock initial select and update
        (supabase.from as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockResolvedValue({ data: mockTodos, error: null }),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis()
            })
            .mockReturnValueOnce({
                update: jest.fn().mockResolvedValue({
                    data: [{ ...mockTodos[0], is_complete: true }],
                    error: null
                })
            });

        render(<TodoList session={mockSession} />);

        // Wait for todos to load
        await waitFor(() => {
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeInTheDocument();
        });

        // Click checkbox to complete todo
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(checkbox).toBeChecked();
        });
    });

    // Test deleting a todo
    test('exclui tarefa', async () => {
        // Mock todo for deletion
        const mockTodos = [{
            id: '1',
            title: 'Tarefa de teste',
            is_complete: false,
            user_id: 'test-user-id'
        }];

        // Mock initial select and delete
        (supabase.from as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockResolvedValue({ data: mockTodos, error: null }),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis()
            })
            .mockReturnValueOnce({
                delete: jest.fn().mockResolvedValue({ data: null, error: null })
            });

        render(<TodoList session={mockSession} />);

        // Wait for todos to load
        await waitFor(() => {
            const deleteButton = screen.getByLabelText(/Excluir tarefa/i);
            expect(deleteButton).toBeInTheDocument();
        });

        // Click delete button
        const deleteButton = screen.getByLabelText(/Excluir tarefa/i);
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByText('Tarefa de teste')).not.toBeInTheDocument();
        });
    });
});