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
            autoClose: 3000,     // Add this line to each toast call
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    };

    const deleteHandler = (id) => {
        axios.delete(`https://blog-maker-vercel.vercel.app/api/blog/delete/${id}`)
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
        axios.get("https://blog-maker-vercel.vercel.app/api/blog")
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
        <div className="max-w-6xl mx-auto mt-8 overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded table-auto">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Title</th>
                        <th className="py-3 px-6 text-left">Content</th>
                        <th className="py-3 px-6 text-left">Tags</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Created At</th>
                        <th className="py-3 px-6 text-left">Updated At</th>
                        <th className="py-3 px-6 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                    {props.blogs.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-6">
                                No blogs found.
                            </td>
                        </tr>
                    ) : (
                        props.blogs.map((blog) => (
                            <tr
                                key={blog._id}
                                className="border-b border-gray-200 hover:bg-gray-100 align-top"
                            >
                                <td className="py-3 px-6 align-top">{blog.title}</td>
                                <td className="py-3 px-6 whitespace-normal align-top">{blog.content}</td>
                                <td className="py-3 px-6 align-top">{Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags}</td>
                                <td className="py-3 px-6 align-top">{blog.status}</td>
                                <td className="py-3 px-6 align-top">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-6 align-top">
                                    {new Date(blog.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-6 align-top flex gap-4">
                                    <button
                                        onClick={() => {
                                            props.setEditWindow(true);
                                            props.setEditData(blog);
                                            props.setBlogId(blog._id);
                                        }}
                                        className='bg-blue-200 p-2 rounded cursor-pointer'
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => props.deleteHandler(blog._id)}
                                        className='bg-red-200 p-2 rounded cursor-pointer'
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
