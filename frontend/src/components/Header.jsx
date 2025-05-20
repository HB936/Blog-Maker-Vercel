import React from 'react'
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-gray-800 p-4">
            <nav className="container mx-auto flex space-x-6">
                <Link to="/" className="text-white font-semibold hover:text-yellow-400">
                    Home
                </Link>
                <Link to="/create" className="text-white font-semibold hover:text-yellow-400">
                    Create Blogs
                </Link>
                <Link to="/drafts" className="text-white font-semibold hover:text-yellow-400">
                    Drafts
                </Link>
            </nav>
        </header>
    )
}
