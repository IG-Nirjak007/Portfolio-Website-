import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../../services/authService.js';

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(undefined); // undefined = loading

    useEffect(() => {
        getSession().then(setSession);
    }, []);

    // Still checking
    if (session === undefined) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)',
                color: 'var(--muted)',
                fontFamily: 'var(--sans)',
                fontSize: '0.9rem',
                gap: '0.75rem'
            }}>
                <div style={{
                    width: 20, height: 20,
                    border: '2px solid var(--line)',
                    borderTopColor: 'var(--ink)',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite'
                }} />
                Verifying session…
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
}
