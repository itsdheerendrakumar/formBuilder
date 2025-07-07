// Updated: src/pages/TemplateBuilder.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateUniqueId } from '../utils/helper.js';
import Modal from './Modal.jsx';
import FieldEditor from './FieldEditor.jsx';
import Sidebar from './Sidebar.jsx';
import FormCanvas from './FormCanvas.jsx';
import SectionEditor from './SectionEditor.jsx'; // NEW: Section editor modal
import Renderer from "./Renderer.jsx"

const TemplateBuilder = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]); // CHANGED: Replaced fields with sections
    const [selectedField, setSelectedField] = useState(null);
    const [selectedSectionId, setSelectedSectionId] = useState(null); // NEW: Track section for field
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isSectionEditorOpen, setIsSectionEditorOpen] = useState(false); // NEW
    const [templateName, setTemplateName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isEditSection, setIsEditSection] = useState(false);
    const [editSectionData, setEditSectionData] = useState({});
    const [isPreview, setIsPreview] = useState(false);
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddSection = (sectionData) => {
        const newSection = {
            id: generateUniqueId(),
            name: sectionData.name,
            columns: sectionData.columns,
            fields: []
        };
        setSections(prev => [...prev, newSection]);
        setIsSectionEditorOpen(false);
    };
    const handleEditSection = (sectionData) => {
        setSections(prev => prev.map((value) => value.id === editSectionData.id ? {...value, name: sectionData.name, columns: sectionData.columns}: value));
        setIsSectionEditorOpen(false);
        setIsEditSection(false);
        setEditSectionData({})
    };
    const handleDeleteSection = (sectionId) => {
        const newSections = sections.filter((value) => value.id !== sectionId)
        setSections([...newSections])
    }
    const handleEditSectionModalOpen = (sectionId) => {
        setIsSectionEditorOpen(true);
        setIsEditSection(true);
        setEditSectionData(sections.find((value) => value.id === sectionId))
    }

    const handleAddField = (type, sectionId) => {
        const newField = {
            id: generateUniqueId(),
            type,
            label: '',
            placeholder: '',
            required: false,
            options: [],
        };
        setSections(prevSections =>
            prevSections.map(sec =>
                sec.id === sectionId ? { ...sec, fields: [...sec.fields, newField] } : sec
            )
        );
        setSelectedField(newField);
        setSelectedSectionId(sectionId);
        setIsEditorOpen(true);
    };

    const handleUpdateField = (updatedField) => {
        setSections(prevSections =>
            prevSections.map(sec =>
                sec.id === selectedSectionId
                    ? {
                          ...sec,
                          fields: sec.fields.map(f => (f.id === updatedField.id ? updatedField : f))
                      }
                    : sec
            )
        );
        setSelectedField(null);
        setIsEditorOpen(false);
    };

    const handleDeleteField = (fieldId, sectionId) => {
        setSections(prev =>
            prev.map(sec =>
                sec.id === sectionId
                    ? { ...sec, fields: sec.fields.filter(f => f.id !== fieldId) }
                    : sec
            )
        );
        if (selectedField && selectedField.id === fieldId) {
            setSelectedField(null);
            setIsEditorOpen(false);
        }
    };

    const handleSelectField = (field, sectionId) => {
        setSelectedField(field);
        setSelectedSectionId(sectionId);
        setIsEditorOpen(true);
    };

    const handleSortEnd = (sectionId, event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setSections(prev =>
                prev.map(sec => {
                    if (sec.id !== sectionId) return sec;
                    const oldIndex = sec.fields.findIndex(f => f.id === active.id);
                    const newIndex = sec.fields.findIndex(f => f.id === over.id);
                    const updatedFields = [...sec.fields];
                    const [moved] = updatedFields.splice(oldIndex, 1);
                    updatedFields.splice(newIndex, 0, moved);
                    return { ...sec, fields: updatedFields };
                })
            );
        }
    };

    const handleSaveTemplate = () => {
        if (!templateName.trim()) {
            showMessage('Template name cannot be empty!', 'error');
            return;
        }
        if (sections.length === 0) {
            showMessage('Please add at least one section.', 'error');
            return;
        }

        try {
            const existing = JSON.parse(localStorage.getItem('formTemplates')) || [];
            const newTemplate = {
                id: generateUniqueId(),
                name: templateName,
                sections,
                createdAt: new Date().toISOString(),
            };
            localStorage.setItem('formTemplates', JSON.stringify([...existing, newTemplate]));
            showMessage('Template saved successfully!', 'success');
            navigate('/');
        } catch (e) {
            console.error("Error saving template:", e);
            showMessage('Error saving template.', 'error');
        }
    };
    
    const handlePreview = () => {
        setIsPreview(!isPreview)
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6 font-inter">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Form Template Builder</h1>

            {message && (
                <div className={`p-3 mb-4 rounded-md text-center text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </div>
            )}

            <div className="flex-grow flex space-x-6">
                <div>
                    <Sidebar onAddField={(type) => {}} />                       
                </div>

                <div className="flex-grow flex flex-col bg-white rounded-lg shadow-xl p-6 relative">
                    <div className="mb-6 flex">
                        <div className="flex-grow">
                            <label htmlFor="templateName" className="block text-lg font-medium text-gray-700 mb-2">Template Name</label>
                            <input
                                type="text"
                                id="templateName"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-lg"
                                placeholder="Enter template name"
                            />
                        </div>
                        <button
                            onClick={() => setIsSectionEditorOpen(true)}
                            className="ml-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 absolute right-6 top-3"
                        >
                            + Add Section
                        </button>
                    </div>

                    <FormCanvas
                        sections={sections}
                        onAddField={handleAddField}
                        onSelectField={handleSelectField}
                        onDeleteField={handleDeleteField}
                        onSortEnd={handleSortEnd}
                        handleDeleteSection={handleDeleteSection}
                        handleEditSectionModalOpen={handleEditSectionModalOpen}
                        handleEditSection={handleEditSection}
                    />

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={handlePreview}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
                        >
                            Preview
                        </button>
                        <button
                            onClick={handleSaveTemplate}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
                        >
                            Save Template
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} title="Edit Field Properties">
                {selectedField && (
                    <FieldEditor
                        field={selectedField}
                        onUpdateField={handleUpdateField}
                        onClose={() => setIsEditorOpen(false)}
                    />
                )}
            </Modal>

            <Modal isOpen={isSectionEditorOpen} onClose={() => {setIsSectionEditorOpen(false); setIsEditSection(false)}} title={isEditSection ? "Edit Section" : "Add New Section"}>
                <SectionEditor
                    onSubmit={isEditSection ? handleEditSection : handleAddSection}
                    onCancel={() => setIsSectionEditorOpen(false)}
                    isEditSection={isEditSection}
                    editSectionData = {editSectionData}
                />
            </Modal>
            <Modal isOpen={isPreview} onClose={handlePreview} title="Preview">
                <Renderer
                    template={{
                        id: generateUniqueId(),
                        name: templateName,
                        sections,
                        createdAt: new Date().toISOString(),
                    }}
                    mode="create"
                    isPreview={isPreview}
                />
            </Modal>
        </div>
    );
};

export default TemplateBuilder;
