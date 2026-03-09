// src/components/Section.jsx
import React from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    KeyboardSensor,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import FieldItem from './FieldItem';
import { Pencil, Trash } from 'lucide-react';

const Section = ({ section, onAddField, onSelectField, onDeleteField, onSortEnd, handleDeleteSection, handleEditSectionModalOpen }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDrop = (event) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('field-type');
        if (type) {
            onAddField(type, section.id);
        }
    };

    return (
        <div
            className="p-4 border border-gray-300 rounded bg-white shadow-sm min-h-24"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <div className={`flex items-start ${section?.name?.length > 0 ? "justify-between" : "justify-end"}`}>
                {section?.name?.length > 0 && <h2 className="font-semibold mb-4">{section.name}</h2>}
                <div className='flex gap-2.5 mb-4 [&>button]:rounded-lg [&>button]:text-white [&>button]:cursor-pointer [&>button]:p-1'>         
                    <button type="button" className="rounded-full p-1" onClick={() => handleEditSectionModalOpen(section.id)}
                    >
                        <Pencil className="text-blue-500" size={20}/>
                    </button>
                    <button type="button" className="rounded-full p-1" onClick={() => handleDeleteSection(section.id)}
                    >
                        <Trash className="text-red-500" size={20}/>
                    </button>
                </div>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => onSortEnd(section.id, event)}>
                <SortableContext items={section.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    <div
                        className={`grid gap-4`}
                    >
                        {section.fields.map((field) => (
                            <FieldItem
                                key={field.id}
                                field={field}
                                onSelectField={() => onSelectField(field, section.id)}
                                onDeleteField={() => onDeleteField(field.id, section.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default Section;
