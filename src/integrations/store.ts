const API_URL = import.meta.env.VITE_API_URL ?? '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions<TBody = unknown> = {
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

async function request<TResponse, TBody = unknown>(
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = (await res.json()) as { message?: string };
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
      // Ignore non-JSON error bodies.
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return undefined as TResponse;
  }

  return (await res.json()) as TResponse;
}

export const store = {
  get<TResponse>(endpoint: string, options?: Omit<RequestOptions, 'body'>) {
    return request<TResponse>('GET', endpoint, options);
  },
  post<TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<RequestOptions<TBody>, 'body'>) {
    return request<TResponse, TBody>('POST', endpoint, { ...options, body });
  },
  put<TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<RequestOptions<TBody>, 'body'>) {
    return request<TResponse, TBody>('PUT', endpoint, { ...options, body });
  },
  patch<TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<RequestOptions<TBody>, 'body'>) {
    return request<TResponse, TBody>('PATCH', endpoint, { ...options, body });
  },
  delete<TResponse>(endpoint: string, options?: Omit<RequestOptions, 'body'>) {
    return request<TResponse>('DELETE', endpoint, options);
  },
};

export default store;
