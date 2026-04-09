async function getJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  getJson,
};
