// src/pages/TemplatesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TemplatesPage = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    useEffect(() => {
        try {
            const storedTemplates = JSON.parse(localStorage.getItem('formTemplates')) || [];
            setTemplates(storedTemplates);
        } catch (error) {
            console.error("Error loading templates from local storage:", error);
            showMessage('Error loading templates.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-lg font-semibold text-gray-700">Loading templates...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 font-inter">
            <button
                onClick={() => navigate(`/create-template`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md cursor-pointer"
            >
                Create New Template
            </button>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Form Templates</h1>

            {message && (
                <div className={`p-3 mb-4 rounded-md text-center text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </div>
            )}

            {templates.length === 0 ? (
                <div className="text-center text-gray-600 text-lg mt-12">
                    <p className="mb-4">No templates created yet.</p>
                    <button
                        onClick={() => navigate('/create-template')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                    >
                        Create Your First Template
                    </button>
                </div>
            ) : (
                <div className="rounded-lg p-6 grid grid-cols-4 gap-4">
                    {templates.map((template) => (
                        <div 
                            key={template.id} 
                            className='px-5 py-10 text-center bg-white text-lg shadow-md rounded-md cursor-pointer'
                            onClick={() => navigate(`/saved-forms/${template.id}`)}
                        >
                            <h1>{template.name}</h1>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TemplatesPage;
