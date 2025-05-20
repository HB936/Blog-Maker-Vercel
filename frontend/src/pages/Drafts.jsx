import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EditWrapper from '../components/EditWrapper';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

export default function Drafts() {
    const [editData, setEditData] = useState(null);
    const [blogId, setBlogId] = useState();
    const [drafts, setDrafts] = useState([]);
    const [editWindow, setEditWindow] = useState(false);

    useEffect(() => {
        fetchDrafts();
    }, []);

    const openToast = (msg, flag) => {
        toast(msg, { type: flag ? 'success' : 'error' });
    };

    const deleteHandler = (id) => {
        axios.delete(`https://blog-maker-vercel-backend.vercel.app/api/blog/delete/${id}`)
            .then((success) => {
                if (success.data.status == 1) {
                    fetchDrafts();
                }
                openToast(success.data.msg, success.data.status);
            })
            .catch(() => {
                openToast("Internal Server Error", 0);
            });
    };

    const fetchDrafts = () => {
        axios.get("https://blog-maker-vercel-backend.vercel.app/api/blog")
            .then((success) => {
                if (success.data.status == 1) {
                    const draftBlogs = success.data.blogs.filter(blog => blog.status === 'draft');
                    setDrafts(draftBlogs);
                }
            })
            .catch((error) => {
                console.log("error ", error);
            });
    };

    return (
        <>
            <ToastContainer position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnHover
                pauseOnFocusLoss={false}
                draggable
                toastClassName="z-[9999]" />
            <div>
                <div className={`fixed inset-0 bg-black bg-opacity-25 ${editWindow ? 'flex' : 'hidden'} items-center justify-center z-50`}>
                    <div className="w-[600px] relative">
                        <EditWrapper
                            setEditWindow={setEditWindow}
                            fetchBlogs={fetchDrafts}
                            setEditData={setEditData}
                            editData={editData}
                            blogId={blogId}
                        />
                        <div onClick={() => setEditWindow(false)} className='cursor-pointer absolute w-[40px] h-[40px] flex ps-[15px] items-center bg-red-400 top-0 right-0 rounded-full'>
                            X
                        </div>
                    </div>
                </div>
                <DraftTable drafts={drafts} setEditWindow={setEditWindow} setBlogId={setBlogId} setEditData={setEditData} deleteHandler={deleteHandler} />
            </div>
        </>
    );
}

function DraftTable({ drafts, setEditWindow, setBlogId, setEditData, deleteHandler }) {
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
                    {drafts.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center py-6">
                                No drafts found.
                            </td>
                        </tr>
                    ) : (
                        drafts.map((draft) => (
                            <tr key={draft._id} className="border-b border-gray-200 hover:bg-gray-100 align-top">
                                <td className="py-3 px-6 align-top">{draft.title}</td>
                                <td className="py-3 px-6 whitespace-normal align-top">{draft.content}</td>
                                <td className="py-3 px-6 align-top">{Array.isArray(draft.tags) ? draft.tags.join(', ') : draft.tags}</td>
                                <td className="py-3 px-6 align-top">{draft.status}</td>
                                <td className="py-3 px-6 align-top">{new Date(draft.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-6 align-top">{new Date(draft.updatedAt).toLocaleDateString()}</td>
                                <td className="py-3 px-6 align-top flex gap-4">
                                    <button onClick={() => { setEditWindow(true); setEditData(draft); setBlogId(draft._id); }} className='bg-blue-200 p-2 rounded cursor-pointer'>Edit</button>
                                    <button onClick={() => deleteHandler(draft._id)} className='bg-red-200 p-2 rounded cursor-pointer'>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
