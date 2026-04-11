async function requestJson(path, options = {}) {
  const { headers, ...restOptions } = options;

  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...restOptions,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || `Request failed with status ${response.status}`);
    error.statusCode = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function getJson(path, options = {}) {
  return requestJson(path, { method: 'GET', ...options });
}

async function postJson(path, body, options = {}) {
  return requestJson(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
}

async function putJson(path, body, options = {}) {
  return requestJson(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  });
}

export const apiClient = {
  getJson,
  postJson,
  putJson,
  requestJson,
};
