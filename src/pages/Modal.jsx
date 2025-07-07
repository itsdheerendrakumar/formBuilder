// src/components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 right-0 bottom-0 left-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 h-screen">
            <div className={`bg-white rounded-lg shadow-xl w-full ${title !== "Preview" && "max-w-md"} p-6 relative flex flex-col  max-h-[90vh]`}>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                    &times;
                </button>
                <div className='overflow-y-auto'>
                {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
