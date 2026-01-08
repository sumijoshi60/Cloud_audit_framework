import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children, showBackButton = false, backTo = '/' }) {
    return (
        <div className="layout">
            <header className="header">
                <div className="header-container">
                    <Link to="/" className="logo">
                        <span className="logo-icon">🔒</span>
                        <span className="logo-text">Cloud Security Audit</span>
                    </Link>
                    {showBackButton && (
                        <Link to={backTo} className="back-button">
                            ← Back
                        </Link>
                    )}
                </div>
            </header>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <p>© 2026 Cloud Security Audit Framework | Client-Side Assessment Tool</p>
            </footer>
        </div>
    );
}
