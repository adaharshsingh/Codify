import { Router } from 'express';
import { parse as parseHtml } from 'node-html-parser';

const router = Router();

// ── LaTeX → readable text ──────────────────────────────────────────────
function processLatex(text = '') {
  return text
    .replace(/\$\$\$([^$]+)\$\$\$/g, (_, m) => ` ${m.trim()} `)  // CF display math $$$...$$$
    .replace(/\$\$([^$]+)\$\$/g,     (_, m) => ` ${m.trim()} `)  // display math
    .replace(/\$([^$\n]+)\$/g,        (_, m) => m.trim())          // inline math
    .replace(/\\le(?:q)?/g,  '≤').replace(/\\ge(?:q)?/g, '≥')
    .replace(/\\neq|\\ne/g,  '≠').replace(/\\times/g,    '×')
    .replace(/\\cdot/g,      '·').replace(/\\ldots/g,    '…')
    .replace(/\\text\{([^}]+)\}/g,   '$1')
    .replace(/\\textbf\{([^}]+)\}/g, '$1')
    .replace(/\\textit\{([^}]+)\}/g, '$1')
    .replace(/\^(\{[^}]+\}|[0-9]+)/g, (_, m) => `^${m.replace(/[{}]/g, '')}`)
    .replace(/_(\{[^}]+\}|[0-9a-z])/g,(_, m) => `_${m.replace(/[{}]/g, '')}`)
    .replace(/\\[a-zA-Z]+/g, '')    // strip remaining cmds
    .replace(/\s+/g, ' ')
    .trim();
}

// ── HTML → plain text (generic) ────────────────────────────────────────
function htmlToText(html = '') {
  return processLatex(
    html
      .replace(/<(?:br|p|\/p|div|\/div|li|\/li)[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

// ── Parse LeetCode HTML sections ───────────────────────────────────────
function parseLeetCodeContent(html) {
  const text = htmlToText(html);

  const stmtEnd = text.search(/\bExample\s*\d/i);
  const statement = (stmtEnd > 0 ? text.slice(0, stmtEnd) : text.slice(0, 700)).trim();

  const conMatch = text.match(/Constraints?:\s*([\s\S]+?)(?:\n\nH(?:ints?|ollow)|Follow[- ]up|$)/i);
  const constraints = conMatch
    ? conMatch[1].trim().split('\n').filter(Boolean).map((l) => `• ${l.trim()}`).join('\n')
    : '';

  const examples = [];
  const exRe = /Example\s*\d+[:\s]+([\s\S]+?)(?=Example\s*\d+:|Constraints?:|$)/gi;
  let m;
  while ((m = exRe.exec(text)) !== null) {
    const block = m[1];
    examples.push({
      input:       (block.match(/Input:\s*([^\n]+)/i)?.[1] || '').trim(),
      output:      (block.match(/Output:\s*([^\n]+)/i)?.[1] || '').trim(),
      explanation: (block.match(/Explanation:\s*([^\n]+)/i)?.[1] || '').trim(),
    });
  }
  return { statement, constraints, examples };
}

// ── Fetch from LeetCode ────────────────────────────────────────────────
async function fetchLeetCode(slug) {
  const query = `query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title difficulty content sampleTestCase exampleTestcases
      topicTags { name }
    }
  }`;

  const resp = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com', 'User-Agent': 'Mozilla/5.0' },
    body: JSON.stringify({ query, variables: { titleSlug: slug } }),
  });
  if (!resp.ok) throw new Error(`LeetCode API ${resp.status}`);

  const json = await resp.json();
  const q = json?.data?.question;
  if (!q) throw new Error('Problem not found on LeetCode');

  const { statement, constraints, examples } = parseLeetCodeContent(q.content || '');
  return {
    title:      q.title,
    difficulty: q.difficulty,
    platform:   'LeetCode',
    lcLink:     `https://leetcode.com/problems/${slug}/`,
    statement, constraints, examples,
    tags: q.topicTags?.map((t) => t.name) || [],
  };
}

// ── Fetch from Codeforces (scrape + API) ───────────────────────────────
async function fetchCodeforces(contestId, index) {
  const idx = index.toUpperCase();

  // 1. Fetch API for metadata (rating, tags, limits)
  let apiProblem = null;
  try {
    const apiResp = await fetch(`https://codeforces.com/api/contest.problems?contestId=${contestId}`);
    if (apiResp.ok) {
      const j = await apiResp.json();
      if (j.status === 'OK') apiProblem = j.result.problems.find((p) => p.index === idx);
    }
  } catch (_) { /* non-fatal */ }

  // 2. Scrape the problem page for full statement
  const pageUrl = `https://codeforces.com/contest/${contestId}/problem/${idx}`;
  const pageResp = await fetch(pageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: 'https://codeforces.com',
    },
  });
  if (!pageResp.ok) throw new Error(`Codeforces page returned ${pageResp.status}`);

  const html  = await pageResp.text();
  const root  = parseHtml(html);
  const ps    = root.querySelector('.problem-statement');
  if (!ps) throw new Error('Could not find problem statement on Codeforces page. The problem may require login or the URL may be incorrect.');

  // ── Title ──────────────────────────────────────
  const titleEl = ps.querySelector('.title');
  const rawTitle = titleEl?.text?.trim() || '';
  // Strip leading "A. " / "1234A. " prefix
  const title = rawTitle.replace(/^[A-Z0-9]+\.\s*/i, '').trim()
    || apiProblem?.name || `CF ${contestId}${idx}`;

  // ── Time / memory limits ───────────────────────
  const timeLimitEl = ps.querySelector('.time-limit');
  const memLimitEl  = ps.querySelector('.memory-limit');
  // The property-title child holds the label; the rest is the value
  const timeVal = timeLimitEl?.text?.replace(/time limit per test/i, '').trim() || '';
  const memVal  = memLimitEl?.text?.replace(/memory limit per test/i, '').trim() || '';

  // ── Main statement body ────────────────────────
  // Content between .header and .input-specification (exclusive)
  const statementParts = [];
  let afterHeader = false;
  for (const child of ps.childNodes) {
    const cls = child.classNames || '';
    if (cls.includes('header'))              { afterHeader = true; continue; }
    if (cls.includes('input-specification')) break;
    if (cls.includes('output-specification'))break;
    if (afterHeader) {
      const t = processLatex(child.text?.trim() || '');
      if (t) statementParts.push(t);
    }
  }
  const statement = statementParts.join('\n\n');

  // ── Input / Output specifications ──────────────
  const inputSpec  = ps.querySelector('.input-specification');
  const outputSpec = ps.querySelector('.output-specification');
  const inputText  = processLatex(inputSpec?.text?.replace(/^Input/i, '').trim() || '');
  const outputText = processLatex(outputSpec?.text?.replace(/^Output/i, '').trim() || '');

  // ── Build full statement ───────────────────────
  let fullStatement = statement;
  if (inputText)  fullStatement += `\n\nInput\n${inputText}`;
  if (outputText) fullStatement += `\n\nOutput\n${outputText}`;

  // ── Examples ───────────────────────────────────
  const examples = [];
  const sampleInputs  = ps.querySelectorAll('.sample-tests .input pre');
  const sampleOutputs = ps.querySelectorAll('.sample-tests .output pre');
  for (let i = 0; i < sampleInputs.length; i++) {
    examples.push({
      input:  sampleInputs[i]?.text?.trim()  || '',
      output: sampleOutputs[i]?.text?.trim() || '',
    });
  }

  // ── Note ───────────────────────────────────────
  const noteEl   = ps.querySelector('.note');
  const noteText = processLatex(noteEl?.text?.replace(/^Note/i, '').trim() || '');
  if (noteText) fullStatement += `\n\nNote\n${noteText}`;

  // ── Constraints string ─────────────────────────
  const rating = apiProblem?.rating;
  const constraints = [
    timeVal  && `• Time limit: ${timeVal}`,
    memVal   && `• Memory limit: ${memVal}`,
    rating   && `• CF Rating: ${rating}`,
    apiProblem?.tags?.length && `• Tags: ${apiProblem.tags.join(', ')}`,
  ].filter(Boolean).join('\n');

  // ── Difficulty from rating ─────────────────────
  const difficulty = !rating ? 'Medium'
    : rating <= 1300 ? 'Easy'
    : rating <= 1900 ? 'Medium'
    : 'Hard';

  return {
    title,
    difficulty,
    platform:    'Codeforces',
    lcLink:      pageUrl,
    statement:   fullStatement.trim(),
    constraints,
    examples,
    tags:        apiProblem?.tags || [],
    rating,
  };
}

// ── GET /api/fetch-problem?url=… ───────────────────────────────────────
router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query param required' });

  try {
    // LeetCode
    const lcMatch = url.match(/leetcode\.com\/problems\/([^/?#]+)/i);
    if (lcMatch) return res.json(await fetchLeetCode(lcMatch[1]));

    // Codeforces — /contest/ID/problem/X
    const cf1 = url.match(/codeforces\.com\/contest\/(\d+)\/problem\/([A-Z0-9]+)/i);
    if (cf1) return res.json(await fetchCodeforces(cf1[1], cf1[2]));

    // Codeforces — /problemset/problem/ID/X
    const cf2 = url.match(/codeforces\.com\/problemset\/problem\/(\d+)\/([A-Z0-9]+)/i);
    if (cf2) return res.json(await fetchCodeforces(cf2[1], cf2[2]));

    // Codeforces Gym — /gym/ID/problem/X
    const cfGym = url.match(/codeforces\.com\/gym\/(\d+)\/problem\/([A-Z0-9]+)/i);
    if (cfGym) return res.json(await fetchCodeforces(cfGym[1], cfGym[2]));

    return res.status(400).json({ error: 'Unsupported link. Paste a LeetCode or Codeforces problem URL.' });
  } catch (err) {
    console.error('[fetch-problem]', err.message);
    return res.status(500).json({ error: err.message || 'Fetch failed' });
  }
});

export default router;
