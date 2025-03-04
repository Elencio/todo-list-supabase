import { useState, useEffect } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../services/supabaseClient"
import Login from "../pages/Login"
import TodoList from "../pages/TodoList"

export default function Home() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 mx-auto"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {!session ? (
                    <Login />
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Logado como:</p>
                                <p className="font-medium text-gray-900">{session.user.email}</p>
                            </div>
                            <button
                                className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                onClick={() => supabase.auth.signOut()}
                            >
                                Sair
                            </button>
                        </div>
                        <TodoList session={session} />
                    </div>
                )}
            </div>
        </div>
    )
}

