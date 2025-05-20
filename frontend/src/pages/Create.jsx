import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function Create() {
    const [status, setStatus] = useState(''); // 'published' or 'draft'
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [draftId, setDraftId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const autoSaveIntervalRef = useRef(null);
    
    // Required for saveDraft to access the latest formData
    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Set typing flag to true
        setIsTyping(true);
        
        // Clear any existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout to save after 5 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            saveDraft();
        }, 5000);
    };

    // Save draft function
    const saveDraft = async () => {
        // Get current form data from ref to ensure we have the latest values
        const currentFormData = formDataRef.current;
        
        // Only save if there's content to save
        if (!currentFormData.title && !currentFormData.content) return;
        
        const data = {
            title: currentFormData.title,
            content: currentFormData.content,
            tags: currentFormData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== ''),
            status: 'draft'
        };

        try {
            let response;
            
            // If we have a draft ID, update it
            if (draftId) {
                response = await axios.patch(`https://blog-maker-vercel-backend.vercel.app/api/blog/update/${draftId}`, data);
            } else {
                // Otherwise create a new draft
                response = await axios.post('https://blog-maker-vercel-backend.vercel.app/api/blog/save-draft', data);
                
                // Store the draft ID for future updates
                if (response.data.id) {
                    setDraftId(response.data.id);
                }
            }
            
            // Show toast notification for auto-save
            toast.success("Auto-saved as draft", {
                position: "bottom-right",
                autoClose: 2000
            });
        } catch (error) {
            console.error("Error saving draft:", error);
            toast.error("Failed to auto-save draft", {
                position: "bottom-right"
            });
        }
    };

    // Set up interval for periodic saving
    useEffect(() => {
        // Set up auto-save every 30 seconds
        autoSaveIntervalRef.current = setInterval(() => {
            saveDraft();
        }, 30000);
        
        // Cleanup function
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (autoSaveIntervalRef.current) {
                clearInterval(autoSaveIntervalRef.current);
            }
        };
    }, []);

    const openToast = (msg, flag) => {
        toast(msg, { type: flag ? 'success' : 'error' });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!status) {
            openToast("Please select 'Publish' or 'Save as Draft' first", 0);
            return;
        }

        const data = {
            title: formData.title,
            content: formData.content,
            tags: formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== ''),
            status: status
        };

        try {
            const url = status === 'published'
                ? 'https://blog-maker-vercel-backend.vercel.app/api/blog/publish'
                : 'https://blog-maker-vercel-backend.vercel.app/api/blog/save-draft';

            const response = await axios.post(url, data);
            
            if (response.data.status === 'published' || response.data.status === 'draft') {
                // If publishing, remove the draft
                if (status === 'published' && draftId) {
                    try {
                        await axios.delete(`https://blog-maker-vercel-backend.vercel.app/api/blog/delete-draft/${draftId}`);
                    } catch (error) {
                        console.error("Error removing draft after publishing:", error);
                    }
                }
                
                // Reset the form
                setFormData({
                    title: '',
                    content: '',
                    tags: ''
                });
                setStatus('');
                setDraftId(null);
                
                // Clear any pending timeout
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
            }
            
            openToast(response.data.msg, response.data.status === 'published' || response.data.status === 'draft');
        } catch (error) {
            openToast("Internal Server Error", 0);
        }
    };

    return (
        <>
            <BlogForm 
                submitHandler={submitHandler} 
                setStatus={setStatus} 
                formData={formData}
                handleChange={handleChange}
            />
        </>
    );
}

function BlogForm({ submitHandler, setStatus, formData, handleChange }) {
    return (
        <div>
            <ToastContainer />
            <form onSubmit={submitHandler} className="max-w-xl my-7 mx-auto p-6 bg-white rounded shadow-md space-y-6">
                <div>
                    <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter blog title"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows="6"
                        value={formData.content}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Write your blog content here"
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-gray-700 font-semibold mb-2">
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="e.g. intro, welcome"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        onClick={() => setStatus('published')}
                        className="bg-green-500 text-white font-semibold px-6 py-2 rounded hover:bg-green-600"
                    >
                        Publish Blog
                    </button>

                    <button
                        type="submit"
                        onClick={() => setStatus('draft')}
                        className="bg-blue-500 text-white font-semibold px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Save as Draft
                    </button>
                </div>
            </form>
        </div>
    );
}

export { BlogForm };
