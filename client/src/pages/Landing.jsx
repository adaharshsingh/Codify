import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const NAV_ITEMS = ['Home', 'Topics', 'Practice', 'Resources', 'Community', 'Store'];

const FLOATING_CARDS = [
  { icon: '🔍', title: 'Binary Search',       count: '4 problems',  diff: 'Easy',   cls: 'diff-easy'   },
  { icon: '⚡', title: 'Dynamic Programming', count: '4 problems',  diff: 'Medium', cls: 'diff-medium' },
  { icon: '🌐', title: 'Graph Algorithms',    count: '4 problems',  diff: 'Hard',   cls: 'diff-hard'   },
];

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Landing() {
  const navigate = useNavigate();
  const { user, authLoading, googleLogin } = useApp();
  const btnRef = useRef(null);

  // If already logged in, skip to home
  useEffect(() => {
    if (!authLoading && user) navigate('/home');
  }, [user, authLoading, navigate]);

  // Render Google Sign-In button once GSI script is ready
  useEffect(() => {
    if (authLoading || !btnRef.current) return;

    const init = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async ({ credential }) => {
          try {
            await googleLogin(credential);
            navigate('/home');
          } catch {
            alert('Sign-in failed. Please try again.');
          }
        },
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 280,
      });
    };

    // GSI might already be loaded or might still be loading
    if (window.google?.accounts?.id) {
      init();
    } else {
      const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (script) script.addEventListener('load', init);
    }
  }, [authLoading, googleLogin, navigate]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy-950">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans">

      {/* ── Vertical side nav ──────────────────────────── */}
      <nav className="fixed left-0 top-0 h-full w-14 bg-navy-900 flex flex-col items-center justify-center z-30 gap-8">
        {NAV_ITEMS.map((item) => (
          <span
            key={item}
            className="text-[10px] text-navy-400 hover:text-gold-400 cursor-pointer transition-colors tracking-[0.2em] font-medium select-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {item}
          </span>
        ))}
      </nav>

      {/* ── Left white panel ───────────────────────────── */}
      <div className="ml-14 w-[38%] flex-shrink-0 bg-white flex flex-col justify-center px-10 py-16 relative z-10 shadow-2xl">
        {/* Logo */}
        <div className="absolute top-8 left-10">
          <span className="text-navy-950 font-black text-2xl tracking-tight">Codify</span>
        </div>

        <div className="mt-6">
          <p className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-4">
            Competitive Programming
          </p>
          <h1 className="text-navy-950 text-5xl font-black leading-[1.1] mb-5">
            Let's Master<br />
            <span className="text-navy-800">Algorithms</span>
          </h1>
          <div className="w-14 h-[3px] bg-gold-500 rounded-full mb-6" />
          <p className="text-navy-400 text-sm leading-relaxed mb-10 max-w-[280px]">
            A curated sheet for fast revision of CP topics — from Binary Search to Segment Trees.
            Structured. Focused. Efficient.
          </p>

          {/* Google Sign-In button */}
          <div className="mb-4">
            <div ref={btnRef} id="google-signin-btn" />
          </div>

          <p className="text-navy-400 text-xs mt-3">
            Sign in with your Google account to save progress across devices.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 flex items-center gap-6">
          {[['400+', 'Problems'], ['3', 'Topics'], ['100%', 'Free']].map(([num, label], i, arr) => (
            <div key={label} className="flex items-center gap-6">
              <div>
                <div className="text-3xl font-black text-navy-950">{num}</div>
                <div className="text-xs text-navy-400 font-medium mt-0.5">{label}</div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-10 bg-navy-100" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right dark panel ───────────────────────────── */}
      <div className="flex-1 bg-navy-950 relative overflow-hidden flex items-center justify-center">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Glow blob */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* Floating topic cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-72 h-72">
            {FLOATING_CARDS.map((c, i) => (
              <div
                key={c.title}
                className={`
                  absolute bg-navy-800/80 backdrop-blur-md border border-navy-700/60
                  rounded-2xl p-4 flex items-center gap-3 w-60 shadow-xl
                  transition-transform hover:-translate-y-1 duration-300
                `}
                style={{
                  top:     i === 0 ? '-60px' : i === 1 ? '80px' : '220px',
                  left:    i === 0 ? '20px'  : i === 1 ? '-30px' : '40px',
                  animation: `float ${3 + i * 0.7}s ease-in-out ${i * 0.5}s infinite`,
                }}
              >
                <span className="text-2xl">{c.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-semibold text-sm truncate">{c.title}</div>
                  <div className="text-navy-400 text-xs">{c.count}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${c.cls}`}>
                  {c.diff}
                </span>
              </div>
            ))}
          </div>

          {/* Code snippet */}
          <div className="absolute bottom-12 right-12 w-72 bg-navy-900 border border-navy-700 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-navy-800 border-b border-navy-700">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-navy-400 text-xs font-mono">solution.cpp</span>
            </div>
            <pre className="text-xs font-mono p-4 leading-6 overflow-hidden">
              <span className="tok-kw">int</span>{' '}
              <span className="tok-fn">binarySearch</span>
              {'(vector<int>& a, int t) {\n'}
              {'  '}<span className="tok-kw">int</span>{' lo=0, hi=a.size()-'}
              <span className="tok-num">1</span>{';  if (lo <= hi) {\n'}
              {'    '}<span className="tok-kw">int</span>{' mid=lo+(hi-lo)/'}
              <span className="tok-num">2</span>{';  if (a[mid]==t) '}
              <span className="tok-kw">return</span>{' mid;\n'}
              {'  } '}<span className="tok-kw">return</span>{' -'}
              <span className="tok-num">1</span>{';  }'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
