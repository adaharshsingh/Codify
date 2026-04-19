import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getSheets, createSheet, deleteSheet } from '../api/index.js';
import SheetCard from '../components/SheetCard.jsx';

const EMOJIS = ['📚', '⚡', '🌐', '🔍', '🧠', '🎯', '🔥', '💡', '🏆', '🌳'];

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const [sheets,  setSheets]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState({ name: '', description: '', emoji: '📚' });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    getSheets()
      .then(setSheets)
      .catch(() => setSheets([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const sheet = await createSheet(form);
      setSheets((prev) => [...prev, sheet]);
      setModal(false);
      setForm({ name: '', description: '', emoji: '📚' });
    } catch {
      alert('Failed to create sheet. Is the server running?');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sheet?')) return;
    try {
      await deleteSheet(id);
      setSheets((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Failed to delete sheet.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="border-b border-navy-800 bg-navy-900/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-xl tracking-tight">Codify</span>
            <span className="text-navy-600 text-sm">/</span>
            <span className="text-navy-400 text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-navy-600"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                  {user?.name?.[0]}
                </div>
              )}
              <span className="text-white text-sm font-medium hidden sm:block">{user?.name}</span>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-navy-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-navy-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-1">
            Welcome back, <span className="text-gold-400">{user?.name}</span> 👋
          </h1>
          <p className="text-navy-400 text-sm">Pick a sheet to revise or create a new one.</p>
        </div>

        {/* Sheets header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Your Sheets</h2>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-gold-500/20 hover:-translate-y-0.5 duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            New Sheet
          </button>
        </div>

        {/* Sheet grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-navy-800/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : sheets.length === 0 ? (
          <div className="text-center py-24 text-navy-500">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-semibold text-navy-400">No sheets yet</p>
            <p className="text-sm mt-1">Create your first sheet to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sheets.map((sheet) => (
              <SheetCard
                key={sheet.id}
                sheet={sheet}
                onClick={() => navigate(`/sheet/${sheet.id}`)}
                onDelete={() => handleDelete(sheet.id)}
              />
            ))}
            {/* Add card */}
            <button
              onClick={() => setModal(true)}
              className="h-40 border-2 border-dashed border-navy-700 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-navy-800 group-hover:bg-gold-500/20 flex items-center justify-center transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-400 group-hover:text-gold-400 transition-colors"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <span className="text-navy-500 group-hover:text-navy-300 text-sm font-medium transition-colors">New Sheet</span>
            </button>
          </div>
        )}
      </main>

      {/* ── New Sheet Modal ─────────────────────────────── */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-navy-900 border border-navy-700 rounded-2xl p-8 w-[440px] shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-xl font-bold mb-6">Create New Sheet</h2>

            <form onSubmit={handleCreate} className="space-y-5">
              {/* Emoji picker */}
              <div>
                <label className="text-navy-400 text-xs font-semibold uppercase tracking-wider block mb-2">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setForm((f) => ({ ...f, emoji: em }))}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        form.emoji === em
                          ? 'bg-gold-500/30 border-2 border-gold-500 scale-110'
                          : 'bg-navy-800 border-2 border-transparent hover:border-navy-600'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-navy-400 text-xs font-semibold uppercase tracking-wider block mb-2">Sheet Name *</label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. DSA Revision, Graph Theory…"
                  className="w-full bg-navy-800 border border-navy-600 focus:border-gold-500 text-white placeholder-navy-500 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-navy-400 text-xs font-semibold uppercase tracking-wider block mb-2">Description (optional)</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description…"
                  className="w-full bg-navy-800 border border-navy-600 focus:border-gold-500 text-white placeholder-navy-500 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)}
                  className="flex-1 py-3 bg-navy-800 hover:bg-navy-700 text-navy-300 font-medium rounded-xl transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-white font-bold rounded-xl transition-all text-sm">
                  {saving ? 'Creating…' : 'Create Sheet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
