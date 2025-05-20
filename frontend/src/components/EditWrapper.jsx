import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function EditWrapper(props) {
    const [status, setStatus] = useState(props.editData?.status || '');
    const [formData, setFormData] = useState({
        title: props.editData?.title || '',
        content: props.editData?.content || '',
        tags: Array.isArray(props.editData?.tags) ? props.editData.tags.join(', ') : ''
    });
    const [isTyping, setIsTyping] = useState(false);
    const [draftId, setDraftId] = useState(null);
    const typingTimeoutRef = useRef(null);
    const autoSaveIntervalRef = useRef(null);

    // Required for saveDraft to access the latest formData
    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // Initialize form data when edit data changes
    useEffect(() => {
        if (props.editData) {
            setFormData({
                title: props.editData.title || '',
                content: props.editData.content || '',
                tags: Array.isArray(props.editData.tags) ? props.editData.tags.join(', ') : ''
            });
            setStatus(props.editData.status || '');

            // If we're editing a draft, store its ID
            if (props.editData.status === 'draft') {
                setDraftId(props.blogId);
            }
        }
    }, [props.editData, props.blogId]);

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
            // If we're editing a published blog, create a draft version
            if (props.editData?.status === 'published' && !draftId) {
                const response = await axios.post('http://localhost:5000/api/blog/save-draft', {
                    ...data,
                    originalBlogId: props.blogId // Connect to original published blog
                });

                if (response.data.id) {
                    setDraftId(response.data.id);
                }
            }
            // If we already have a draft ID, update it
            else if (draftId) {
                await axios.patch(`http://localhost:5000/api/blog/update/${draftId}`, data);
            }
            // If we're editing an existing draft, update it
            else if (props.blogId) {
                await axios.patch(`http://localhost:5000/api/blog/update/${props.blogId}`, data);
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
    }

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
        }

        try {
            const response = await axios.patch(`http://localhost:5000/api/blog/update/${props.blogId}`, data);

            if (response.data.status === 1) {
                // If publishing, remove any auto-saved drafts
                if (status === 'published' && draftId && draftId !== props.blogId) {
                    try {
                        await axios.delete(`http://localhost:5000/api/blog/delete-draft/${draftId}`);
                    } catch (error) {
                        console.error("Error removing draft after publishing:", error);
                    }
                }

                // Reset and close the edit window
                props.setEditData(null);
                props.fetchBlogs();
                props.setEditWindow(false);
            }

            openToast(response.data.msg, response.data.status);
        } catch (error) {
            openToast("Internal Server Error", 0);
        }
    }

    return (
        <div>
            <ToastContainer />

            <form onSubmit={submitHandler} className="max-w-xl my-7 mx-auto p-6 bg-white rounded shadow-md space-y-6">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                    <p className="font-bold">Auto-save enabled</p>
                    <p>Your content will automatically save as a draft after 5 seconds of inactivity and every 30 seconds.</p>
                    <p>Current status: <span className={status === 'published' ? 'text-green-600 font-bold' : 'text-blue-600 font-bold'}>{status || 'Not set'}</span></p>
                </div>
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
                        className={`${status === 'published' ? 'bg-green-600' : 'bg-green-500'} text-white font-semibold px-6 py-2 rounded hover:bg-green-600`}
                    >
                        Publish Blog
                    </button>

                    <button
                        type="submit"
                        onClick={() => setStatus('draft')}
                        className={`${status === 'draft' ? 'bg-blue-600' : 'bg-blue-500'} text-white font-semibold px-6 py-2 rounded hover:bg-blue-600`}
                    >
                        Save as Draft
                    </button>
                </div>
            </form>
        </div>
    )
}