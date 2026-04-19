import { v4 as uuidv4 } from 'uuid';
import { topics as seed } from './data/mockProblems.js';

// Mutable in-memory store — deep clone so mutations don't affect seed
const topics = seed.map((t) => ({
  ...t,
  problems: t.problems.map((p) => ({ ...p, topicId: t.id, topicTitle: t.title })),
}));

const problemMap = {};
topics.forEach((t) => t.problems.forEach((p) => { problemMap[p.id] = p; }));

// ── Topic CRUD ─────────────────────────────────────────────────────────
export function getTopics() { return topics; }

export function addTopic(data) {
  const t = { id: uuidv4(), problems: [], ...data };
  topics.push(t);
  return t;
}

export function deleteTopic(id) {
  const idx = topics.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  topics[idx].problems.forEach((p) => delete problemMap[p.id]);
  topics.splice(idx, 1);
  return true;
}

// ── Problem CRUD ───────────────────────────────────────────────────────
export function getProblem(id) { return problemMap[id] || null; }

export function addProblem(topicId, data) {
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) return null;
  const p = { id: uuidv4(), topicId, topicTitle: topic.title, ...data };
  topic.problems.push(p);
  problemMap[p.id] = p;
  return p;
}

export function deleteProblem(problemId) {
  const p = problemMap[problemId];
  if (!p) return false;
  const topic = topics.find((t) => t.id === p.topicId);
  if (topic) {
    const idx = topic.problems.findIndex((x) => x.id === problemId);
    if (idx !== -1) topic.problems.splice(idx, 1);
  }
  delete problemMap[problemId];
  return true;
}
