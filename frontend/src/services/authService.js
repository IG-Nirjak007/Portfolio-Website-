import { supabase } from './supabase.js';

/**
 * Sign in with email and password using Supabase Auth.
 */
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

/**
 * Sign out the currently authenticated user.
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

/**
 * Get the current session (returns null if not logged in).
 */
export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

/**
 * Subscribe to auth state changes. Returns the unsubscribe function.
 */
export const onAuthStateChange = (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
    return () => subscription.unsubscribe();
};
