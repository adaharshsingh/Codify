import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

// ── Auth ────────────────────────────────────────
export const googleAuth = (credential) =>
  api.post('/auth/google', { credential }).then((r) => r.data);

export const getMe = () =>
  api.get('/auth/me').then((r) => r.data);

// ── Problems ────────────────────────────────────
export const getTopics    = ()    => api.get('/problems/topics').then((r) => r.data);
export const getProblem   = (id)  => api.get(`/problems/${id}`).then((r) => r.data);

// ── Topic CRUD ──────────────────────────────────
export const createTopic  = (data)         => api.post('/problems/topics', data).then((r) => r.data);
export const deleteTopic  = (id)           => api.delete(`/problems/topics/${id}`).then((r) => r.data);

// ── Problem CRUD ────────────────────────────────
export const addProblem    = (topicId, data) => api.post(`/problems/topics/${topicId}/problems`, data).then((r) => r.data);
export const removeProblem = (id)            => api.delete(`/problems/${id}`).then((r) => r.data);

// ── Auto-fetch by URL ───────────────────────────
export const fetchByUrl   = (url) => api.get('/fetch-problem', { params: { url } }).then((r) => r.data);

// ── Progress ──────────────────────────────────── (cookie auth, no userId needed)
export const getProgress  = ()        => api.get('/progress').then((r) => r.data);
export const saveProgress = (payload) => api.post('/progress', payload).then((r) => r.data);

// ── Sheets ──────────────────────────────────────  (cookie auth, no userId in URL)
export const getSheets    = ()       => api.get('/sheets').then((r) => r.data);
export const createSheet  = (body)   => api.post('/sheets', body).then((r) => r.data);
export const deleteSheet  = (sid)    => api.delete(`/sheets/${sid}`).then((r) => r.data);
