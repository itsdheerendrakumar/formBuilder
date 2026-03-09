// src/components/FieldEditor.js
import React, { useState, useEffect } from 'react';

const FieldEditor = ({ field, onUpdateField, onClose }) => {
    const [label, setLabel] = useState(field.label || '');
    const [placeholder, setPlaceholder] = useState(field.placeholder || '');
    const [required, setRequired] = useState(field.required || false);
    const [options, setOptions] = useState(field.options ? field.options.join('\n') : '');

    useEffect(() => {
        setLabel(field.label || '');
        setPlaceholder(field.placeholder || '');
        setRequired(field.required || false);
        setOptions(field.options ? field.options.join('\n') : '');
    }, [field]);

    const handleSave = () => {
        const updatedField = {
            ...field,
            label,
            placeholder,
            required,
        };
        if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
            updatedField.options = options.split('\n').map(opt => opt.trim()).filter(opt => opt !== '');
        }
        onUpdateField(updatedField);
        onClose();
    };

    return (
        <div className="space-y-4 px-2">
            <div>
                <label htmlFor="fieldLabel" className="block text-sm font-medium">Label Name</label>
                <input
                    type="text"
                    id="fieldLabel"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
            </div>
            {(field.type === 'input' || field.type === 'textarea') && (
                <div>
                    <label htmlFor="fieldPlaceholder" className="block text-sm font-medium">Placeholder</label>
                    <input
                        type="text"
                        id="fieldPlaceholder"
                        value={placeholder}
                        onChange={(e) => setPlaceholder(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                </div>
            )}
            <div>
                <label htmlFor="fieldRequired" className="flex items-center text-sm font-medium">
                    <input
                        type="checkbox"
                        id="fieldRequired"
                        checked={required}
                        onChange={(e) => setRequired(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                    />
                    Required
                </label>
            </div>
            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                <div>
                    <label htmlFor="fieldOptions" className="block text-sm font-medium">Options (one per line)</label>
                    <textarea
                        id="fieldOptions"
                        value={options}
                        onChange={(e) => setOptions(e.target.value)}
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    ></textarea>
                </div>
            )}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default FieldEditor;
