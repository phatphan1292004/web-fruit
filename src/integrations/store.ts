"use server";

import axios, { type AxiosRequestConfig } from "axios";

export const storeClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const readCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

// Automatically attach Authorization Bearer token and x-user-uid headers to all requests from cookies
storeClient.interceptors.request.use(
  (config) => {
    console.log('[Axios Interceptor] Intercepting request to:', config.url);
    const token = readCookie('token');
    const uid = readCookie('userId');
    console.log('[Axios Interceptor] Read cookies -> token:', token ? `${token.substring(0, 15)}...` : 'null', 'uid:', uid);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (uid) {
      config.headers['x-user-uid'] = uid;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const get = async <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  defaultReturn?: T,
  onError?: (error: unknown) => T
) => {
  try {
    const res = await storeClient.request({
      method: "GET",
      url,
      params,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      console.log("Failed to fetch data from store", res.data);
      if (onError) {
        return onError(res.data);
      } else if (defaultReturn) {
        return defaultReturn;
      } else {
        return res.data;
      }
    }
  } catch (error) {
    if (onError) {
      return onError(error);
    } else if (defaultReturn) {
      return defaultReturn;
    } else {
      return null;
    }
  }
};

export const post = async <T = unknown, D = unknown>(
  url: string,
  data?: D,
  defaultReturn?: T,
  onError?: (error: unknown) => T,
  config?: AxiosRequestConfig<D>
) => {
  try {
    console.log(`POST: ${url}`, data);
    const res = await storeClient.request({
      method: "POST",
      url,
      data,
      ...config,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      if (onError) {
        return onError(res.data);
      } else if (defaultReturn) {
        return defaultReturn;
      } else {
        console.log(res.data);
        return res.data;
      }
    }
  } catch (error) {
    console.error(error);
    if (onError) {
      return onError(error);
    } else if (defaultReturn) {
      return defaultReturn;
    } else {
      return null;
    }
  }
};

export const put = async <T = unknown, D = unknown>(
  url: string,
  data?: D,
  defaultReturn?: T,
  onError?: (error: unknown) => T
) => {
  try {
    const res = await storeClient.request({
      method: "PUT",
      url,
      data,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      if (onError) {
        return onError(res.data);
      } else if (defaultReturn) {
        return defaultReturn;
      } else {
        return res.data;
      }
    }
  } catch (error) {
    if (onError) {
      return onError(error);
    } else if (defaultReturn) {
      return defaultReturn;
    } else {
      return null;
    }
  }
};

export const del = async <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  defaultReturn?: T,
  onError?: (error: unknown) => T
) => {
  try {
    const res = await storeClient.request({
      method: "DELETE",
      url,
      params,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      if (onError) {
        return onError(res.data);
      } else if (defaultReturn) {
        return defaultReturn;
      } else {
        return res.data;
      }
    }
  } catch (error) {
    if (onError) {
      return onError(error);
    } else if (defaultReturn) {
      return defaultReturn;
    } else {
      return null;
    }
  }
};

export const patch = async <T = unknown, D = unknown>(
  url: string,
  data?: D,
  defaultReturn?: T,
  onError?: (error: unknown) => T
) => {
  try {
    const res = await storeClient.request({
      method: "PATCH",
      url,
      data,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      if (onError) {
        return onError(res.data);
      } else if (defaultReturn) {
        return defaultReturn;
      } else {
        return res.data;
      }
    }
  } catch (error) {
    if (onError) {
      return onError(error);
    } else if (defaultReturn) {
      return defaultReturn;
    } else {
      return null;
    }
  }
};

export default {
  get,
  post,
  put,
  del,
  patch,
};
