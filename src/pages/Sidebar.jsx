// src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ onAddField }) => {
    const fieldTypes = [
        { id: 'input', label: 'Text Input' },
        { id: 'textarea', label: 'Text Area' },
        { id: 'select', label: 'Dropdown' },
        { id: 'checkbox', label: 'Checkbox' },
        { id: 'radio', label: 'Radio Buttons' },
        { id: 'resident-dropdown', label: 'Resident List'}
    ];

    return (
        <div className="w-64 bg-gray-50 p-6 border-r border-gray-200 shadow-lg rounded-lg sticky top-0 left-0">
            <h2 className="font-semibold mb-6">Field Types</h2>
            <div className="space-y-4">
                {fieldTypes.map((type) => (
                    <div
                        key={type.id}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('field-type', type.id);
                        }}
                        className="p-4 bg-white rounded-md shadow-sm border border-gray-200 hover:border-blue-400 cursor-grab transition duration-200 ease-in-out text-center font-medium"
                    >
                        {type.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
