import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BlogForm } from './Create';
import EditWrapper from '../components/EditWrapper';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

export default function Home() {
    const [editData, setEditData] = useState(null);
    const [blogId, setBlogId] = useState();
    const [blogs, setBlogs] = useState([]);
    const [editWindow, setEditWindow] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const openToast = (msg, flag) => {
        toast(msg, {
            type: flag ? 'success' : 'error',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    };

    const deleteHandler = (id) => {
        axios.delete(`https://blog-maker-vercel-backend.vercel.app/api/blog/delete/${id}`)
            .then((success) => {
                if (success.data.status == 1) {
                    fetchBlogs();
                }
                openToast(success.data.msg, success.data.status);
            })
            .catch((error) => {
                openToast("Internal Server Error", 0);
            });
    };

    const fetchBlogs = () => {
        axios.get("https://blog-maker-vercel-backend.vercel.app/api/blog")
            .then((success) => {
                if (success.data.status == 1) {
                    const publishedBlogs = success.data.blogs.filter(blog => blog.status === 'published');
                    setBlogs(publishedBlogs);
                }
            })
            .catch((error) => {
                console.log("error ", error);
            });
    };

    // Handle closing the edit window
    const handleCloseEditWindow = () => {
        setEditWindow(false);
        // Refresh blogs when the edit window is closed
        fetchBlogs();
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnHover
                pauseOnFocusLoss={false}
                draggable
                toastClassName="z-[9999]"
            />
            <div>
                <div className={`fixed inset-0 bg-black bg-opacity-25 ${editWindow ? 'flex' : 'hidden'} items-center justify-center z-50`}>
                    <div className="w-[600px] relative">
                        <EditWrapper
                            setEditWindow={setEditWindow}
                            fetchBlogs={fetchBlogs}
                            setEditData={setEditData}
                            editData={editData}
                            blogId={blogId}
                        />
                        <div
                            onClick={handleCloseEditWindow}
                            className='cursor-pointer absolute w-[40px] h-[40px] flex ps-[15px] items-center bg-red-400 top-0 right-0 rounded-full'
                        >
                            X
                        </div>
                    </div>
                </div>
                <BlogTable
                    blogs={blogs}
                    setEditWindow={setEditWindow}
                    setBlogId={setBlogId}
                    setEditData={setEditData}
                    deleteHandler={deleteHandler}
                />
            </div>
        </>
    );
}

function BlogTable(props) {
    return (
        <div className="container mx-auto mt-8 px-4">
            {props.blogs.length === 0 ? (
                <div className="text-center py-6 bg-white shadow rounded">
                    No blogs found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {props.blogs.map((blog) => (
                        <div key={blog._id} className="bg-white shadow rounded p-4 border-l-4 border-blue-500">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Left Column - Blog Info */}
                                <div className="md:col-span-9">
                                    <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                                    
                                    <div className="mb-4">
                                        <div className="font-semibold text-sm text-gray-700 mb-1">Content:</div>
                                        <div className="bg-gray-50 p-3 rounded max-h-60 overflow-y-auto break-words whitespace-pre-wrap">
                                            {blog.content}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                        <div>
                                            <span className="font-semibold text-gray-700">Tags: </span>
                                            <span>{Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Status: </span>
                                            <span>{blog.status}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Created: </span>
                                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm mt-2">
                                        <span className="font-semibold text-gray-700">Updated: </span>
                                        <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                
                                {/* Right Column - Actions */}
                                <div className="md:col-span-3 flex md:flex-col justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            props.setEditWindow(true);
                                            props.setEditData(blog);
                                            props.setBlogId(blog._id);
                                        }}
                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded cursor-pointer flex-1 text-center"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => props.deleteHandler(blog._id)}
                                        className="bg-red-200 hover:bg-red-300 p-2 rounded cursor-pointer flex-1 text-center"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
