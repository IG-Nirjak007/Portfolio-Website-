import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, getSession } from '../../services/authService.js';
import {
    getProjects, createProject, updateProject, deleteProject,
    getExperiences, createExperience, updateExperience, deleteExperience,
    getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink,
    getResumeUrl, updateSiteConfig,
} from '../../services/api.js';
import '../../style.css';
import './admin.css';
import { LOCAL_PROJECTS, LOCAL_EXPERIENCES } from '../../App.jsx';

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`admin-toast ${type}`} role="alert">
            {type === 'success' ? '✓' : '⚠'} {message}
        </div>
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ itemName, onConfirm, onCancel, loading }) {
    return (
        <div className="admin-modal-overlay" onClick={onCancel}>
            <div className="admin-modal admin-delete-modal" onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <span className="admin-modal-title">⚠ Confirm Delete</span>
                    <button className="admin-modal-close" onClick={onCancel}>✕</button>
                </div>
                <p className="admin-delete-body">
                    Are you sure you want to delete{' '}
                    <span className="admin-delete-name">"{itemName}"</span>?<br />
                    This action cannot be undone.
                </p>
                <div className="admin-form-actions">
                    <button className="admin-cancel-btn" onClick={onCancel} disabled={loading}>Cancel</button>
                    <button className="admin-delete-btn" onClick={onConfirm} disabled={loading}>
                        {loading ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── PROJECT FORM ─────────────────────────────────────────────────────────────
const EMPTY_PROJECT = { title: '', description: '', technologies: '', link: '', category: '' };

function ProjectForm({ initial, onSave, onCancel, loading }) {
    const [form, setForm] = useState(initial || EMPTY_PROJECT);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    return (
        <form className="admin-form" onSubmit={e => { e.preventDefault(); onSave(form); }}>
            <div className="admin-field">
                <label className="admin-label">Title *</label>
                <input id="proj-title" className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="admin-field">
                <label className="admin-label">Description *</label>
                <textarea id="proj-desc" className="admin-textarea" value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="admin-field">
                <label className="admin-label">Technologies (comma-separated)</label>
                <input id="proj-tech" className="admin-input" value={form.technologies} onChange={e => set('technologies', e.target.value)} placeholder="React, Node.js, PostgreSQL" />
            </div>
            <div className="admin-field">
                <label className="admin-label">Category</label>
                <input id="proj-cat" className="admin-input" value={form.category} onChange={e => set('category', e.target.value)} placeholder="Full-Stack Web App" />
            </div>
            <div className="admin-field">
                <label className="admin-label">GitHub / Live Link</label>
                <input id="proj-link" className="admin-input" type="text" value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://github.com/... or JSON array" />
            </div>
            <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={onCancel} disabled={loading}>Cancel</button>
                <button type="submit" className="admin-submit-btn" disabled={loading}>
                    {loading ? 'Saving…' : (initial ? 'Update Project' : 'Add Project')}
                </button>
            </div>
        </form>
    );
}

// ─── EXPERIENCE FORM ──────────────────────────────────────────────────────────
const EMPTY_EXP = { role: '', company: '', location: '', start_date: '', end_date: '', description: '' };

function ExperienceForm({ initial, onSave, onCancel, loading }) {
    const [form, setForm] = useState(initial || EMPTY_EXP);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    return (
        <form className="admin-form" onSubmit={e => { e.preventDefault(); onSave(form); }}>
            <div className="admin-field">
                <label className="admin-label">Role / Title *</label>
                <input id="exp-role" className="admin-input" value={form.role} onChange={e => set('role', e.target.value)} required />
            </div>
            <div className="admin-field">
                <label className="admin-label">Company / Institution *</label>
                <input id="exp-company" className="admin-input" value={form.company} onChange={e => set('company', e.target.value)} required />
            </div>
            <div className="admin-field">
                <label className="admin-label">Location</label>
                <input id="exp-location" className="admin-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Kathmandu, Nepal" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-field">
                    <label className="admin-label">Start Date</label>
                    <input id="exp-start" className="admin-input" value={form.start_date} onChange={e => set('start_date', e.target.value)} placeholder="2022" />
                </div>
                <div className="admin-field">
                    <label className="admin-label">End Date</label>
                    <input id="exp-end" className="admin-input" value={form.end_date} onChange={e => set('end_date', e.target.value)} placeholder="Present" />
                </div>
            </div>
            <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea id="exp-desc" className="admin-textarea" value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={onCancel} disabled={loading}>Cancel</button>
                <button type="submit" className="admin-submit-btn" disabled={loading}>
                    {loading ? 'Saving…' : (initial ? 'Update Entry' : 'Add Entry')}
                </button>
            </div>
        </form>
    );
}

// ─── SOCIAL LINK FORM ─────────────────────────────────────────────────────────
const EMPTY_LINK = { platform: '', url: '' };

function SocialLinkForm({ initial, onSave, onCancel, loading }) {
    const [form, setForm] = useState(initial || EMPTY_LINK);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    return (
        <form className="admin-form" onSubmit={e => { e.preventDefault(); onSave(form); }}>
            <div className="admin-field">
                <label className="admin-label">Platform *</label>
                <input id="link-platform" className="admin-input" value={form.platform} onChange={e => set('platform', e.target.value)} placeholder="GitHub, LinkedIn, Twitter…" required />
            </div>
            <div className="admin-field">
                <label className="admin-label">URL *</label>
                <input id="link-url" className="admin-input" type="url" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://github.com/..." required />
            </div>
            <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={onCancel} disabled={loading}>Cancel</button>
                <button type="submit" className="admin-submit-btn" disabled={loading}>
                    {loading ? 'Saving…' : (initial ? 'Update Link' : 'Add Link')}
                </button>
            </div>
        </form>
    );
}

// ─── PROJECTS TAB ─────────────────────────────────────────────────────────────
function ProjectsTab({ toast }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'add' | {edit: proj}
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        getProjects().then(setProjects).finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            if (modal?.edit) {
                const { id, ...rest } = { ...modal.edit, ...form };
                await updateProject(id, rest);
                toast('Project updated!', 'success');
            } else {
                await createProject(form);
                toast('Project added!', 'success');
            }
            setModal(null);
            load();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deleteProject(deleteTarget.id);
            toast('Project deleted.', 'success');
            setDeleteTarget(null);
            load();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const displayedProjects = [...projects];
    LOCAL_PROJECTS.forEach(lp => {
        if (!projects.some(p => p.title === lp.title)) {
            displayedProjects.push({ ...lp, isLocal: true });
        }
    });

    return (
        <div>
            <div className="admin-action-bar">
                <div>
                    <div className="admin-topbar-title">Projects</div>
                    <div className="admin-topbar-subtitle">{displayedProjects.length} total</div>
                </div>
                <button id="add-project-btn" className="admin-add-btn" onClick={() => setModal('add')}>
                    + Add Project
                </button>
            </div>

            {loading ? (
                <div className="admin-empty"><div className="state-spinner" style={{ margin: '0 auto 1rem' }} /></div>
            ) : displayedProjects.length === 0 ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">📁</div>
                    <div className="admin-empty-text">No projects yet. Add your first one!</div>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Technologies</th>
                                <th>Link</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedProjects.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <span className="admin-table-title">{p.title}</span>
                                        {p.isLocal && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--subtle)', fontStyle: 'italic' }}>(Local)</span>}
                                    </td>
                                    <td>{p.category && <span className="admin-table-tag admin-tag-accent">{p.category}</span>}</td>
                                    <td>
                                        {p.technologies?.split(',').slice(0, 3).map(t => (
                                            <span key={t} className="admin-table-tag">{t.trim()}</span>
                                        ))}
                                    </td>
                                    <td>
                                        {(() => {
                                            let displayLinks = p.links;
                                            if (!displayLinks && p.link && p.link.startsWith('[') && p.link.endsWith(']')) {
                                                try { displayLinks = JSON.parse(p.link); } catch (e) {}
                                            }

                                            if (displayLinks) {
                                                return (
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        {displayLinks.map((lnk, idx) => (
                                                            <a key={idx} href={lnk.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-dot)', fontSize: '0.82rem' }}>
                                                                ↗ {lnk.label}
                                                            </a>
                                                        ))}
                                                    </div>
                                                );
                                            } else if (p.link) {
                                                return (
                                                    <a href={p.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-dot)', fontSize: '0.82rem' }}>
                                                        ↗ View
                                                    </a>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </td>
                                    <td>
                                        <div className="admin-row-actions">
                                            {p.isLocal ? (
                                                <button className="admin-btn-icon" style={{ color: 'var(--accent-dot)', whiteSpace: 'nowrap' }} onClick={async () => {
                                                    setSaving(true);
                                                    try {
                                                        const { id, isLocal, links, ...rest } = p;
                                                        if (links) {
                                                            rest.link = JSON.stringify(links);
                                                        }
                                                        await createProject(rest);
                                                        toast('Published to database!', 'success');
                                                        load();
                                                    } catch (e) {
                                                        toast(e.message, 'error');
                                                    } finally {
                                                        setSaving(false);
                                                    }
                                                }}>☁ Publish to DB</button>
                                            ) : (
                                                <>
                                                    <button id={`edit-proj-${p.id}`} className="admin-btn-icon" onClick={() => setModal({ edit: p })}>✏ Edit</button>
                                                    <button id={`del-proj-${p.id}`} className="admin-btn-icon danger" onClick={() => setDeleteTarget(p)}>🗑 Delete</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(modal === 'add' || modal?.edit) && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <span className="admin-modal-title">{modal?.edit ? 'Edit Project' : 'Add New Project'}</span>
                            <button className="admin-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <ProjectForm initial={modal?.edit} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
                    </div>
                </div>
            )}

            {deleteTarget && (
                <DeleteModal
                    itemName={deleteTarget.title}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={saving}
                />
            )}
        </div>
    );
}

// ─── EXPERIENCES TAB ──────────────────────────────────────────────────────────
function ExperiencesTab({ toast }) {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        getExperiences().then(setExperiences).finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            if (modal?.edit) {
                const { id, ...rest } = { ...modal.edit, ...form };
                await updateExperience(id, rest);
                toast('Experience updated!', 'success');
            } else {
                await createExperience(form);
                toast('Experience added!', 'success');
            }
            setModal(null);
            load();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deleteExperience(deleteTarget.id);
            toast('Entry deleted.', 'success');
            setDeleteTarget(null);
            load();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const displayedExperiences = [...experiences];
    LOCAL_EXPERIENCES.forEach(le => {
        if (!experiences.some(e => e.role === le.role && e.company === le.company)) {
            displayedExperiences.push({ ...le, isLocal: true });
        }
    });

    return (
        <div>
            <div className="admin-action-bar">
                <div>
                    <div className="admin-topbar-title">Experience</div>
                    <div className="admin-topbar-subtitle">{displayedExperiences.length} entries</div>
                </div>
                <button id="add-experience-btn" className="admin-add-btn" onClick={() => setModal('add')}>
                    + Add Entry
                </button>
            </div>

            {loading ? (
                <div className="admin-empty"><div className="state-spinner" style={{ margin: '0 auto 1rem' }} /></div>
            ) : displayedExperiences.length === 0 ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">💼</div>
                    <div className="admin-empty-text">No experience entries yet.</div>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Company</th>
                                <th>Period</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedExperiences.map(e => (
                                <tr key={e.id}>
                                    <td>
                                        <span className="admin-table-title">{e.role}</span>
                                        {e.isLocal && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--subtle)', fontStyle: 'italic' }}>(Local)</span>}
                                    </td>
                                    <td>{e.company}</td>
                                    <td>
                                        <span className="admin-table-tag">{e.start_date} – {e.end_date}</span>
                                    </td>
                                    <td>{e.location}</td>
                                    <td>
                                        <div className="admin-row-actions">
                                            {e.isLocal ? (
                                                <button className="admin-btn-icon" style={{ color: 'var(--accent-dot)', whiteSpace: 'nowrap' }} onClick={async () => {
                                                    setSaving(true);
                                                    try {
                                                        const { id, isLocal, ...rest } = e;
                                                        await createExperience(rest);
                                                        toast('Published to database!', 'success');
                                                        load();
                                                    } catch (err) {
                                                        toast(err.message, 'error');
                                                    } finally {
                                                        setSaving(false);
                                                    }
                                                }}>☁ Publish to DB</button>
                                            ) : (
                                                <>
                                                    <button id={`edit-exp-${e.id}`} className="admin-btn-icon" onClick={() => setModal({ edit: e })}>✏ Edit</button>
                                                    <button id={`del-exp-${e.id}`} className="admin-btn-icon danger" onClick={() => setDeleteTarget(e)}>🗑 Delete</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(modal === 'add' || modal?.edit) && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <span className="admin-modal-title">{modal?.edit ? 'Edit Entry' : 'Add Experience'}</span>
                            <button className="admin-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <ExperienceForm initial={modal?.edit} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
                    </div>
                </div>
            )}

            {deleteTarget && (
                <DeleteModal
                    itemName={deleteTarget.role}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={saving}
                />
            )}
        </div>
    );
}

// ─── SOCIAL LINKS TAB ────────────────────────────────────────────────────────
function SocialLinksTab({ toast }) {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        getSocialLinks().then(setLinks).finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            if (modal?.edit) {
                const { id, ...rest } = { ...modal.edit, ...form };
                await updateSocialLink(id, rest);
                toast('Link updated!', 'success');
            } else {
                await createSocialLink(form);
                toast('Link added!', 'success');
            }
            setModal(null);
            load();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deleteSocialLink(deleteTarget.id);
            toast('Link deleted.', 'success');
            setDeleteTarget(null);
            load();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="admin-action-bar">
                <div>
                    <div className="admin-topbar-title">Social Links</div>
                    <div className="admin-topbar-subtitle">{links.length} links</div>
                </div>
                <button id="add-social-btn" className="admin-add-btn" onClick={() => setModal('add')}>
                    + Add Link
                </button>
            </div>

            {loading ? (
                <div className="admin-empty"><div className="state-spinner" style={{ margin: '0 auto 1rem' }} /></div>
            ) : links.length === 0 ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">🔗</div>
                    <div className="admin-empty-text">No social links yet.</div>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Platform</th>
                                <th>URL</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map(l => (
                                <tr key={l.id}>
                                    <td><span className="admin-table-title">{l.platform}</span></td>
                                    <td>
                                        <a href={l.url} target="_blank" rel="noreferrer"
                                            style={{ color: 'var(--accent-dot)', fontSize: '0.82rem', fontFamily: 'var(--mono)' }}>
                                            {l.url}
                                        </a>
                                    </td>
                                    <td>
                                        <div className="admin-row-actions">
                                            <button id={`edit-link-${l.id}`} className="admin-btn-icon" onClick={() => setModal({ edit: l })}>✏ Edit</button>
                                            <button id={`del-link-${l.id}`} className="admin-btn-icon danger" onClick={() => setDeleteTarget(l)}>🗑 Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(modal === 'add' || modal?.edit) && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <span className="admin-modal-title">{modal?.edit ? 'Edit Link' : 'Add Social Link'}</span>
                            <button className="admin-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <SocialLinkForm initial={modal?.edit} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
                    </div>
                </div>
            )}

            {deleteTarget && (
                <DeleteModal
                    itemName={deleteTarget.platform}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={saving}
                />
            )}
        </div>
    );
}

// ─── RESUME TAB ───────────────────────────────────────────────────────────────
function ResumeTab({ toast }) {
    const [url, setUrl] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getResumeUrl().then(u => {
            setUrl(u);
            setNewUrl(u);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSiteConfig('resume_url', newUrl);
            setUrl(newUrl);
            setEditing(false);
            toast('Resume URL updated!', 'success');
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="admin-topbar-title" style={{ marginBottom: '0.4rem' }}>Resume / CV</div>
            <div className="admin-topbar-subtitle" style={{ marginBottom: '1.5rem' }}>
                Manage the public resume download link shown on your portfolio
            </div>

            <div className="admin-resume-card">
                <div className="admin-label" style={{ marginBottom: '0.5rem' }}>Current Resume URL</div>
                {loading ? (
                    <div className="admin-empty"><div className="state-spinner" style={{ margin: '0 auto' }} /></div>
                ) : (
                    <>
                        <div className={`admin-resume-url-display ${!url ? 'empty' : ''}`}>
                            {url || 'No resume URL set yet.'}
                        </div>

                        {!editing ? (
                            <div className="admin-resume-actions">
                                {url && (
                                    <a href={url} target="_blank" rel="noreferrer" className="admin-resume-preview-link">
                                        👁 Preview PDF
                                    </a>
                                )}
                                {url && (
                                    <a href={url} download="Nirjak_Resume.pdf" className="admin-resume-preview-link">
                                        ⤓ Download
                                    </a>
                                )}
                                <button
                                    id="edit-resume-url-btn"
                                    className="admin-add-btn"
                                    style={{ borderRadius: '9999px' }}
                                    onClick={() => setEditing(true)}
                                >
                                    ✏ Update URL
                                </button>
                            </div>
                        ) : (
                            <div className="admin-form" style={{ marginTop: '1rem' }}>
                                <div className="admin-field">
                                    <label className="admin-label" htmlFor="resume-url-input">Paste Supabase Storage Public URL</label>
                                    <input
                                        id="resume-url-input"
                                        className="admin-input"
                                        type="url"
                                        value={newUrl}
                                        onChange={e => setNewUrl(e.target.value)}
                                        placeholder="https://qmxsgacspqmevbtkjtix.supabase.co/storage/v1/object/public/resumes/..."
                                    />
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--subtle)', fontFamily: 'var(--mono)' }}>
                                    Upload your PDF to Supabase Storage → resumes bucket → copy public URL → paste above
                                </div>
                                <div className="admin-form-actions">
                                    <button className="admin-cancel-btn" onClick={() => { setEditing(false); setNewUrl(url); }} disabled={saving}>
                                        Cancel
                                    </button>
                                    <button id="save-resume-url-btn" className="admin-submit-btn" onClick={handleSave} disabled={saving}>
                                        {saving ? 'Saving…' : 'Save URL'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--line)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--ink)' }}>💡 How to upload a new resume:</strong><br />
                1. Go to <strong>Supabase Dashboard → Storage → resumes</strong> bucket<br />
                2. Click <strong>Upload File</strong> and select your PDF<br />
                3. Click the file → copy the <strong>Public URL</strong><br />
                4. Paste the URL above and click <strong>Save URL</strong>
            </div>
        </div>
    );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ setTab }) {
    const [counts, setCounts] = useState({ projects: 0, experiences: 0, links: 0 });
    const [resumeSet, setResumeSet] = useState(false);

    useEffect(() => {
        Promise.all([getProjects(), getExperiences(), getSocialLinks(), getResumeUrl()])
            .then(([p, e, l, r]) => {
                const totalProj = p.length + LOCAL_PROJECTS.filter(lp => !p.some(dp => dp.title === lp.title)).length;
                const totalExp = e.length + LOCAL_EXPERIENCES.filter(le => !e.some(de => de.role === le.role && de.company === le.company)).length;
                setCounts({ projects: totalProj, experiences: totalExp, links: l.length });
                setResumeSet(!!r);
            });
    }, []);

    return (
        <div>
            <div className="admin-topbar-title" style={{ marginBottom: '0.25rem' }}>Dashboard Overview</div>
            <div className="admin-topbar-subtitle" style={{ marginBottom: '1.5rem' }}>Welcome back, Nirjak 👋</div>

            <div className="admin-stats-row">
                <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setTab('projects')}>
                    <div className="admin-stat-number">{counts.projects}</div>
                    <div className="admin-stat-label">Projects</div>
                </div>
                <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setTab('experiences')}>
                    <div className="admin-stat-number">{counts.experiences}</div>
                    <div className="admin-stat-label">Experience</div>
                </div>
                <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setTab('social')}>
                    <div className="admin-stat-number">{counts.links}</div>
                    <div className="admin-stat-label">Social Links</div>
                </div>
                <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setTab('resume')}>
                    <div className="admin-stat-number">{resumeSet ? '✓' : '–'}</div>
                    <div className="admin-stat-label">Resume</div>
                </div>
            </div>

            <div className="admin-table-wrap" style={{ padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>
                    Quick Actions
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {[
                        { label: '+ Add Project', tab: 'projects' },
                        { label: '+ Add Experience', tab: 'experiences' },
                        { label: '+ Add Social Link', tab: 'social' },
                        { label: '⤓ Resume Settings', tab: 'resume' },
                    ].map(a => (
                        <button key={a.tab} className="admin-add-btn" onClick={() => setTab(a.tab)}>
                            {a.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: '0.78rem', fontFamily: 'var(--mono)', color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Site Info
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 2 }}>
                    <div>🌐 Portfolio: <a href="/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-dot)' }}>nirjak.com.np</a></div>
                    <div>📧 Email: <span style={{ fontFamily: 'var(--mono)' }}>nirjakbhattarai1@gmail.com</span></div>
                    <div>📞 Phone: <span style={{ fontFamily: 'var(--mono)' }}>+977 9865369292</span></div>
                    <div>💾 Database: <span style={{ color: 'var(--accent-dot)' }}>Supabase PostgreSQL</span></div>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'experiences', label: 'Experience', icon: '💼' },
    { id: 'social', label: 'Social Links', icon: '🔗' },
    { id: 'resume', label: 'Resume / CV', icon: '📄' },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [userEmail, setUserEmail] = useState('');
    const [toast, setToastState] = useState(null); // {message, type}

    useEffect(() => {
        getSession().then(s => {
            if (s?.user?.email) setUserEmail(s.user.email);
        });
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        setToastState({ message, type, key: Date.now() });
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth/login');
    };

    const renderTab = () => {
        switch (tab) {
            case 'overview': return <OverviewTab setTab={setTab} />;
            case 'projects': return <ProjectsTab toast={showToast} />;
            case 'experiences': return <ExperiencesTab toast={showToast} />;
            case 'social': return <SocialLinksTab toast={showToast} />;
            case 'resume': return <ResumeTab toast={showToast} />;
            default: return null;
        }
    };

    return (
        <div className="admin-root">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-logo">
                        Nirjak<span>.</span> <span style={{ fontSize: '0.7rem', fontFamily: 'var(--sans)', fontWeight: 400, color: 'var(--subtle)' }}>Admin</span>
                    </div>
                    <div className="admin-logo-sub">Portfolio CMS</div>
                </div>

                <nav className="admin-nav" aria-label="Admin Navigation">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            className={`admin-nav-item${tab === item.id ? ' active' : ''}`}
                            onClick={() => setTab(item.id)}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}

                    <div className="admin-nav-divider" />

                    <Link to="/" className="admin-nav-item" target="_blank" rel="noreferrer"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="admin-nav-icon">↗</span>
                        View Portfolio
                    </Link>
                </nav>

                <div className="admin-sidebar-footer">
                    {userEmail && (
                        <div className="admin-user-badge" title={userEmail}>
                            👤 {userEmail}
                        </div>
                    )}
                    <button id="admin-signout-btn" className="admin-signout-btn" onClick={handleSignOut}>
                        ⏻ Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {renderTab()}
            </main>

            {/* Toast */}
            {toast && (
                <Toast
                    key={toast.key}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToastState(null)}
                />
            )}
        </div>
    );
}
