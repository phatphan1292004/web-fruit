"use server";

import axios from "axios";

export const storeClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  onError?: (error: unknown) => T
) => {
  try {
    console.log(`POST: ${url}`, data);
    const res = await storeClient.request({
      method: "POST",
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
