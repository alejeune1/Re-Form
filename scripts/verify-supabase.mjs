import { readFileSync } from 'node:fs';

const REQUIRED_TABLES = ['profiles', 'tutorials', 'challenges', 'creations', 'votes', 'creation_likes', 'creation_comments'];
const PUBLIC_CONTENT_CHECKS = [
  { table: 'tutorials', label: 'published tutorials', query: 'select=id&is_published=eq.true&limit=1' },
  { table: 'challenges', label: 'published challenges', query: 'select=id&is_published=eq.true&limit=1' },
];

function readEnvFile(path) {
  const env = {};
  const content = readFileSync(path, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.+)\s*$/);

    if (match) {
      env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }

  return env;
}

function redact(value, supabaseUrl, supabaseKey) {
  return String(value)
    .replaceAll(supabaseUrl, '[SUPABASE_URL]')
    .replaceAll(supabaseKey, '[SUPABASE_ANON_KEY]');
}

async function fetchJson(url, supabaseKey) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      apikey: supabaseKey,
      authorization: `Bearer ${supabaseKey}`,
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  return { response, body };
}

function assertEnv(supabaseUrl, supabaseKey) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  }

  if (!/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(supabaseUrl)) {
    throw new Error('VITE_SUPABASE_URL must be the project base URL: https://<project>.supabase.co');
  }

  if (/service_role/i.test(supabaseKey)) {
    throw new Error('Never use a service_role key in a Vite frontend environment file');
  }
}

async function verifyTable(supabaseUrl, supabaseKey, table) {
  const url = `${supabaseUrl}/rest/v1/${table}?select=id&limit=1`;
  const { response, body } = await fetchJson(url, supabaseKey);

  if (!response.ok) {
    return {
      table,
      ok: false,
      status: response.status,
      detail: body?.message ?? response.statusText,
    };
  }

  return { table, ok: true, status: response.status, detail: 'accessible' };
}

async function verifyPublishedContent(supabaseUrl, supabaseKey, check) {
  const url = `${supabaseUrl}/rest/v1/${check.table}?${check.query}`;
  const { response, body } = await fetchJson(url, supabaseKey);

  if (!response.ok) {
    return {
      label: check.label,
      ok: false,
      detail: body?.message ?? response.statusText,
    };
  }

  return {
    label: check.label,
    ok: Array.isArray(body) && body.length > 0,
    detail: Array.isArray(body) && body.length > 0 ? 'available' : 'empty',
  };
}

try {
  const env = readEnvFile('.env.local');
  const supabaseUrl = env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

  assertEnv(supabaseUrl, supabaseKey);

  const tableResults = await Promise.all(REQUIRED_TABLES.map((table) => verifyTable(supabaseUrl, supabaseKey, table)));
  const contentResults = await Promise.all(PUBLIC_CONTENT_CHECKS.map((check) => verifyPublishedContent(supabaseUrl, supabaseKey, check)));

  console.table(
    tableResults.map((result) => ({
      table: result.table,
      status: result.ok ? 'OK' : `ERROR ${result.status}`,
      detail: redact(result.detail, supabaseUrl, supabaseKey),
    })),
  );

  console.table(
    contentResults.map((result) => ({
      check: result.label,
      status: result.ok ? 'OK' : 'WARNING',
      detail: redact(result.detail, supabaseUrl, supabaseKey),
    })),
  );

  const missingTables = tableResults.filter((result) => !result.ok);

  if (missingTables.length > 0) {
    console.error('Supabase verification failed: required tables are missing or inaccessible.');
    process.exit(1);
  }

  const emptyContent = contentResults.filter((result) => !result.ok);

  if (emptyContent.length > 0) {
    console.warn('Supabase verification warning: published content is empty. Run supabase/seed.sql if needed.');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Unexpected Supabase verification error');
  process.exit(1);
}
