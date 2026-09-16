import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../../services/authService.js';
import '../../style.css';
import './admin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-bg-glow" />

            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <div className="admin-login-logo-text">
                        Nirjak<span>.</span>
                    </div>
                    <div className="admin-login-logo-sub">Admin Portal</div>
                </div>

                <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
                    <div className="admin-login-field">
                        <label className="admin-login-label" htmlFor="admin-email">
                            Email address
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            className="admin-login-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="admin-login-field">
                        <label className="admin-login-label" htmlFor="admin-password">
                            Password
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            className="admin-login-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="admin-login-error" role="alert">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="admin-login-submit"
                        id="admin-signin-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                Signing in…
                            </>
                        ) : (
                            'Sign in →'
                        )}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <Link to="/" className="admin-login-home-link">
                        ← Back to portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
}
