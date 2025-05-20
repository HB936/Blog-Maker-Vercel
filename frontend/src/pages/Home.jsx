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
        <div className="max-w-6xl mx-auto mt-8">
            <div className="overflow-hidden border rounded-lg shadow">
                <table className="w-full table-fixed border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-2 text-left w-24 md:w-32">Title</th>
                            <th className="py-3 px-2 text-left w-64 md:w-80">Content</th>
                            <th className="py-3 px-2 text-left w-32">Tags</th>
                            <th className="py-3 px-2 text-left w-20">Status</th>
                            <th className="py-3 px-2 text-left w-24">Created</th>
                            <th className="py-3 px-2 text-left w-24">Updated</th>
                            <th className="py-3 px-2 text-left w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {props.blogs.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6">
                                    No blogs found.
                                </td>
                            </tr>
                        ) : (
                            props.blogs.map((blog) => (
                                <tr
                                    key={blog._id}
                                    className="border-b border-gray-200 hover:bg-gray-100"
                                >
                                    <td className="py-2 px-2 align-top">
                                        <div className="w-full overflow-hidden break-words">
                                            {blog.title}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 align-top">
                                        <div className="w-full max-h-60 overflow-y-auto whitespace-normal break-words">
                                            {blog.content}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 align-top">
                                        <div className="w-full overflow-hidden break-words">
                                            {Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 align-top">
                                        <div className="w-full overflow-hidden">
                                            {blog.status}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 align-top">
                                        <div className="w-full overflow-hidden">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 align-top">
                                        <div className="w-full overflow-hidden">
                                            {new Date(blog.updatedAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 align-top">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <button
                                                onClick={() => {
                                                    props.setEditWindow(true);
                                                    props.setEditData(blog);
                                                    props.setBlogId(blog._id);
                                                }}
                                                className='bg-blue-200 p-2 rounded cursor-pointer text-center'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => props.deleteHandler(blog._id)}
                                                className='bg-red-200 p-2 rounded cursor-pointer text-center'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
