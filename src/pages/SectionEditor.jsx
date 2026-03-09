// src/components/SectionEditor.jsx
import React, { useState } from 'react';

const SectionEditor = ({ onSubmit, onCancel, isEditSection = false, editSectionData }) => {
    console.log(editSectionData)
    const [name, setName] = useState(isEditSection ? editSectionData.name : "");
    const [columns, setColumns] = useState(isEditSection ? editSectionData.columns : { sm: 1, md: 2, lg: 3 });

    const handleSubmit = () => {
        onSubmit({ name, columns });
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium">Section Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                />
            </div>
            <div className="grid grid-cols-1 gap-4">
                {[{value: 'sm', name: "For Mobile"}, {value: 'md', name: "For tabs"}, {value: 'lg', name: "For large screen"}].map((size) => (
                    <div key={size.value}>
                        <label className="block text-sm font-medium">Columns ({size.name})</label>
                        <input
                            type="number"
                            min={1}
                            max={6}
                            value={columns[size.value]}
                            onChange={(e) => setColumns({ ...columns, [size.value]: parseInt(e.target.value) })}
                            className="w-full mt-1 p-2 border rounded"
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end space-x-4 [&>button]:cursor-pointer">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">{isEditSection ? "Update" : "Add Section"}</button>
            </div>
        </div>
    );
};

export default SectionEditor;
