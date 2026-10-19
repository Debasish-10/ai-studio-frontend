import type {
  Prompt,
  PromptCreate,
  PromptListParameters,
  PromptPage,
  PromptUpdate,
  PromptVersion,
} from '../types/promptLibrary';

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

function createPromptListSearchParameters(
  parameters: PromptListParameters,
): URLSearchParams {
  const searchParameters = new URLSearchParams();

  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined) {
      searchParameters.set(key, String(value));
    }
  }

  return searchParameters;
}

export async function getPrompts(
  parameters: PromptListParameters = {},
): Promise<PromptPage> {
  const searchParameters = createPromptListSearchParameters(parameters);
  const query = searchParameters.size > 0 ? `?${searchParameters}` : '';
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/prompts${query}`);
  } catch {
    throw new Error(
      'Unable to reach the backend. Check that it is running and the API URL is correct.',
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json() as Promise<PromptPage>;
}

export async function createPrompt(payload: PromptCreate): Promise<Prompt> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Unable to reach the backend. Check that it is running and the API URL is correct.',
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json() as Promise<Prompt>;
}

export async function updatePrompt(
  promptId: string,
  payload: PromptUpdate,
): Promise<Prompt> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/prompts/${promptId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Unable to reach the backend. Check that it is running and the API URL is correct.',
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json() as Promise<Prompt>;
}

export async function deletePrompt(promptId: string): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/prompts/${promptId}`, {
      method: 'DELETE',
    });
  } catch {
    throw new Error(
      'Unable to reach the backend. Check that it is running and the API URL is correct.',
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
}

export async function setPromptFavorite(
  promptId: string,
  isFavorite: boolean,
): Promise<Prompt> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/prompts/${promptId}/favorite`, {
      method: isFavorite ? 'PUT' : 'DELETE',
    });
  } catch {
    throw new Error(
      'Unable to reach the backend. Check that it is running and the API URL is correct.',
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json() as Promise<Prompt>;
}

export async function setPromptTemplate(
  promptId: string,
  isTemplate: boolean,
): Promise<Prompt> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/prompts/${promptId}/template`, {
      method: isTemplate ? 'PUT' : 'DELETE',
    });
  } catch {
    throw new Error(
      'Unable to reach the backend. Check that it is running and the API URL is correct.',
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json() as Promise<Prompt>;
}

export async function getPromptVersions(
  promptId: string,
): Promise<PromptVersion[]> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/prompts/${promptId}/versions`);
  } catch {
    throw new Error(
      'Unable to reach the backend. Check that it is running and the API URL is correct.',
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json() as Promise<PromptVersion[]>;
}

export async function getPromptCategories(): Promise<string[]> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/prompts/categories`);
  } catch {
    throw new Error(
      'Unable to reach the backend. Check that it is running and the API URL is correct.',
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json() as Promise<string[]>;
}
