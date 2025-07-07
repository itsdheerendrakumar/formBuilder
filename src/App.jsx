// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TemplateBuilder from './pages/TemplateBuilder';
import TemplatesPage from './pages/TemplatesPage';
import FormFillPage from './pages/FormFillPage';
import SavedFormsPage from './pages/SavedFormsPage';
import ViewFormPage from './pages/ViewFormPage';
import EditFormPage from './pages/EditFormPage';

const App = () => {
    return (
        <div className='bg-[#e5e7eb]'>
            <Router>
                {/* Tailwind CSS import for Inter font */}
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                    body {
                        font-family: 'Inter', sans-serif;
                    }
                    `}
                </style>
                <Routes>
                    {/* <Route path="/" element={<HomePage />} /> */}
                    <Route path="/" element={<TemplatesPage />} />
                    <Route path="/create-template" element={<TemplateBuilder />} />
                    <Route path="/fill-form/:templateId" element={<FormFillPage />} />
                    <Route path="/saved-forms/:templateId" element={<SavedFormsPage />} />
                    <Route path="/view-form/:formId" element={<ViewFormPage />} />
                    <Route path="/edit-form/:formId" element={<EditFormPage />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
