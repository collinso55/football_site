'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-border p-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mx-auto mb-6">
                        ⚽
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Admin Access</h1>
                    <p className="text-slate-500 font-medium mt-2">Sign in to manage match predictions.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-border/50 rounded-2xl p-4 text-slate-900 font-medium focus:border-primary focus:bg-white outline-none transition-all shadow-inner"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-border/50 rounded-2xl p-4 text-slate-900 font-medium focus:border-primary focus:bg-white outline-none transition-all shadow-inner"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-xs font-bold flex items-center gap-3">
                            <span className="text-lg">⚠️</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                        Protected by Supabase Security<br />
                        Restricted Internal Access Only
                    </p>
                </div>
            </div>
        </div>
    );
}
