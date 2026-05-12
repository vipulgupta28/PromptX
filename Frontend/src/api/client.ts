const BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error((data as { error: string }).error || 'Request failed');
  return data as T;
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request<{ token: string; user: import('../types').User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: import('../types').User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

    me: () => request<{ user: import('../types').User }>('/auth/me'),
  },

  prompts: {
    list: (params: { category?: string } = {}) => {
      const qs = params.category ? `?category=${params.category}` : '';
      return request<import('../types').Prompt[]>(`/prompts${qs}`);
    },

    get: (id: number) => request<import('../types').Prompt>(`/prompts/${id}`),

    myPrompts: () => request<import('../types').Prompt[]>('/prompts/user/prompts'),
  },

  payments: {
    createProCheckout: () =>
      request<{ url: string }>('/payments/create-pro-checkout', { method: 'POST', body: JSON.stringify({}) }),

    verifyPro: (sessionId: string) =>
      request<{ success: boolean }>(`/payments/verify-pro/${sessionId}`),
  },
};
