import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { saveProgress as apiSaveProgress, googleAuth, getMe } from '../api/index.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]         = useState(null);   // { id, name, email, picture } | null
  const [authLoading, setAuthLoading] = useState(true);
  const [progress, setProgress] = useState({});     // { [problemId]: { solved, starred, note } }
  const [activeProblem, setActiveProblem] = useState(null);

  // Restore session from JWT cookie on mount
  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  // Called with the raw credential string from Google GSI
  const googleLogin = useCallback(async (credential) => {
    const userData = await googleAuth(credential);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
    setProgress({});
  }, []);

  const updateProgress = useCallback(
    (problemId, patch) => {
      setProgress((prev) => {
        const next = { ...prev, [problemId]: { ...prev[problemId], ...patch } };
        // Fire-and-forget API save (auth handled via cookie)
        apiSaveProgress({ problemId, ...patch }).catch(() => {});
        try { localStorage.setItem('codify_progress', JSON.stringify(next)); } catch (_) {}
        return next;
      });
    },
    []
  );

  const loadProgress = useCallback((serverProgress) => {
    let local = {};
    try { local = JSON.parse(localStorage.getItem('codify_progress') || '{}'); } catch (_) {}
    setProgress({ ...local, ...serverProgress });
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      googleLogin,
      logout,
      progress, updateProgress, loadProgress,
      activeProblem, setActiveProblem,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
