import React from 'react'

interface ErrorAlertProps {
    message: string,
    onClose: () => void
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex justify-between items-center">
        <p> {message} </p>
        <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800"
        >
            Fechar
        </button>
    </div>
)