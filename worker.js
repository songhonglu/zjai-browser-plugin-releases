const REPOSITORY = 'songhonglu/zjai-browser-plugin-releases';
const DATA_PATH = 'downloads.json';
const BRANCH = 'main';
const ASSETS = {
  'v3.4.8': 'zjai-browser-plugin-v3.4.8.zip',
  'v3.4.9': 'zjai-browser-plugin-v3.4.9.zip',
  'v3.4.10': 'zjai-browser-plugin-v3.4.10.zip',
  'v3.4.11': 'zjai-browser-plugin-v3.4.11.zip'
};

function allowedOrigin(request, env) {
  return request.headers.get('Origin') === env.ALLOWED_ORIGIN;
}

function responseHeaders(request, env) {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8'
  });
  const origin = request.headers.get('Origin');
  if (origin && origin === env.ALLOWED_ORIGIN) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Vary', 'Origin');
  }
  return headers;
}

function json(request, env, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(request, env) });
}

function base64ToText(value) {
  const bytes = Uint8Array.from(atob(value.replace(/\s/g, '')), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function textToBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function github(request, env, method, path, body) {
  return fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GH_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'zjai-download-counter',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: body ? JSON.stringify(body) : undefined
  });
}

async function readDownloadData(env) {
  const response = await github(env, env, 'GET', `/repos/${REPOSITORY}/contents/${DATA_PATH}?ref=${BRANCH}`);
  if (!response.ok) throw new Error('GitHub data read failed');
  const file = await response.json();
  return { data: JSON.parse(base64ToText(file.content)), sha: file.sha };
}

function resolveAsset(tag, asset) {
  return ASSETS[tag] === asset ? asset : null;
}

async function incrementDownload(env, tag, asset) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const current = await readDownloadData(env);
    const count = current.data.counts?.[tag]?.[asset];
    if (!Number.isInteger(count)) throw new Error('GitHub data shape invalid');
    current.data.counts[tag][asset] = count + 1;
    const response = await github(env, env, 'PUT', `/repos/${REPOSITORY}/contents/${DATA_PATH}`, {
      branch: BRANCH,
      content: textToBase64(`${JSON.stringify(current.data, null, 2)}\n`),
      message: `更新 ${tag} 下载次数`,
      sha: current.sha
    });
    if (response.ok) return current.data.counts[tag][asset];
    if (response.status !== 409 && response.status !== 422) throw new Error('GitHub data write failed');
  }
  throw new Error('GitHub data write conflict');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if ((request.method === 'POST' || request.method === 'OPTIONS') && !allowedOrigin(request, env)) {
      return json(request, env, { error: 'Origin not allowed' }, 403);
    }
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: responseHeaders(request, env) });

    try {
      if (request.method === 'GET' && url.pathname === '/counts') {
        const { data } = await readDownloadData(env);
        return json(request, env, { counts: data.counts });
      }
      if (request.method === 'POST' && url.pathname === '/download') {
        const { tag, asset } = await request.json();
        if (!resolveAsset(tag, asset)) return json(request, env, { error: 'Invalid release asset' }, 400);
        const count = await incrementDownload(env, tag, asset);
        return json(request, env, {
          count,
          downloadUrl: `https://github.com/${REPOSITORY}/releases/download/${tag}/${asset}`
        });
      }
      return json(request, env, { error: 'Not found' }, 404);
    } catch {
      return json(request, env, { error: 'Counter service unavailable' }, 503);
    }
  }
};
