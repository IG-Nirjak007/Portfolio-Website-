import { supabase } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// ─── READ ────────────────────────────────────────────────────────────────────

export const getProjects = async () => {
    try {
        const { data, error } = await supabase
            .from('project')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (supabaseErr) {
        console.warn('Supabase direct query failed, falling back to REST API:', supabaseErr.message);
        const res = await fetch(`${API_BASE_URL}/projects`);
        if (!res.ok) throw new Error(`REST API error: ${res.status}`);
        return res.json();
    }
};

export const getExperiences = async () => {
    try {
        const { data, error } = await supabase
            .from('experience')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (supabaseErr) {
        console.warn('Supabase direct query failed, falling back to REST API:', supabaseErr.message);
        const res = await fetch(`${API_BASE_URL}/experiences`);
        if (!res.ok) throw new Error(`REST API error: ${res.status}`);
        return res.json();
    }
};

export const getSocialLinks = async () => {
    try {
        const { data, error } = await supabase
            .from('social_link')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (supabaseErr) {
        console.warn('Supabase direct query failed, falling back to REST API:', supabaseErr.message);
        const res = await fetch(`${API_BASE_URL}/social-links`);
        if (!res.ok) throw new Error(`REST API error: ${res.status}`);
        return res.json();
    }
};

export const getResumeUrl = async () => {
    try {
        const { data, error } = await supabase
            .from('site_config')
            .select('value')
            .eq('key', 'resume_url')
            .single();
        if (error) throw error;
        return data?.value || '';
    } catch {
        return '';
    }
};

// ─── PROJECT CRUD ─────────────────────────────────────────────────────────────

export const createProject = async (project) => {
    const { data, error } = await supabase.from('project').insert([project]).select().single();
    if (error) throw error;
    return data;
};

export const updateProject = async (id, updates) => {
    const { data, error } = await supabase.from('project').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteProject = async (id) => {
    const { error } = await supabase.from('project').delete().eq('id', id);
    if (error) throw error;
};

// ─── EXPERIENCE CRUD ──────────────────────────────────────────────────────────

export const createExperience = async (experience) => {
    const { data, error } = await supabase.from('experience').insert([experience]).select().single();
    if (error) throw error;
    return data;
};

export const updateExperience = async (id, updates) => {
    const { data, error } = await supabase.from('experience').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteExperience = async (id) => {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
};

// ─── SOCIAL LINK CRUD ─────────────────────────────────────────────────────────

export const createSocialLink = async (link) => {
    const { data, error } = await supabase.from('social_link').insert([link]).select().single();
    if (error) throw error;
    return data;
};

export const updateSocialLink = async (id, updates) => {
    const { data, error } = await supabase.from('social_link').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteSocialLink = async (id) => {
    const { error } = await supabase.from('social_link').delete().eq('id', id);
    if (error) throw error;
};

// ─── SITE CONFIG ──────────────────────────────────────────────────────────────

export const updateSiteConfig = async (key, value) => {
    const { data, error } = await supabase
        .from('site_config')
        .upsert({ key, value }, { onConflict: 'key' })
        .select()
        .single();
    if (error) throw error;
    return data;
};