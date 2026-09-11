import { supabase } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Primary: Supabase JS client (direct DB connection — no backend needed)
// Fallback: Spring Boot REST API at localhost:8080

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