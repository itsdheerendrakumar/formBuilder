// src/pages/FormFillPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateUniqueId } from '../utils/helper.js';
import FormRenderer from './Renderer'; // Ensure the correct path

const FormFillPage = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
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
            const foundTemplate = storedTemplates.find(t => t.id === templateId);
            if (foundTemplate) {
                setTemplate(foundTemplate);
                fetchResidents(foundTemplate);
            } else {
                showMessage('Template not found.', 'error');
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching template from local storage:", error);
            showMessage('Error loading template.', 'error');
            setLoading(false);
        }
    }, [templateId]);

    const fetchResidents = async (templateData) => {
        try {
            const res = await fetch("http://localhost:4002/api/v1/get-assigned-residents");
            const { data } = await res.json();
            const residents = data.docs.map((i) => ({
                label: `${i.firstName} ${i.lastName}`,
                value: i._id
            }));

            // Update only resident-dropdown fields inside sections
            const updatedSections = templateData.sections.map(section => ({
                ...section,
                fields: section.fields.map(field => ({
                    ...field,
                    options: field.type === 'resident-dropdown' ? residents : field.options
                }))
            }));

            setTemplate({ ...templateData, sections: updatedSections });
        } catch (error) {
            console.error("Error fetching residents:", error);
            showMessage('Error fetching resident list.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitForm = (formData) => {
        try {
            const allSavedForms = JSON.parse(localStorage.getItem('savedForms')) || {};
            const formsForTemplate = allSavedForms[templateId] || [];

            const newFormData = {
                id: generateUniqueId(),
                templateId: templateId,
                data: formData,
                submittedAt: new Date().toISOString(),
            };

            allSavedForms[templateId] = [...formsForTemplate, newFormData];
            localStorage.setItem('savedForms', JSON.stringify(allSavedForms));

            showMessage('Form submitted successfully!', 'success');
            navigate(`/saved-forms/${templateId}`);
        } catch (e) {
            console.error("Error submitting form data to local storage: ", e);
            showMessage('Error submitting form. Please try again.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-lg font-semibold text-gray-700">Loading form...</div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="text-center text-red-500 text-lg p-8">
                {message || "Could not load form template."}
                <button
                    onClick={() => navigate('/templates')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Back to Templates
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            {message && (
                <div className={`p-3 mb-4 rounded-md text-center text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </div>
            )}
            <FormRenderer template={template} mode="create" onSubmit={handleSubmitForm} />
        </div>
    );
};

export default FormFillPage;
