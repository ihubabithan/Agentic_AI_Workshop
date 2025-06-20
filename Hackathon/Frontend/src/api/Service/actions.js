/** ****************************** Import libs *********************************** */
import { act } from 'react';
import { hostConfig } from '../../config';
import API from '../api';
import { URL_CONSTANTS } from './urls';

/* ReLogin API */
export const reLogin = async () => {
  const loggedUser = localStorage.getItem('loggedUser');
  if (!loggedUser) {
    return { error: 'User is not logged in' };
  }

  const accessToken = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken && refreshToken) {
    const extractExpiryFromJWT = (token) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp ? new Date(payload.exp * 1000) : null;
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    };

    const expiryTime = extractExpiryFromJWT(accessToken);

    const currentTime = new Date();
    if (!expiryTime || expiryTime < currentTime) {
      const params = { refreshToken };

      try {
        const response = await fetch(
          `${hostConfig.API_URL}${URL_CONSTANTS.refreshToken}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(params),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }
        const res = await response.json();
        localStorage.setItem('token', res.access.token);
        localStorage.setItem('refreshToken', res.refresh.token);
        return true;
      } catch (error) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  } else {
    localStorage.clear();
    window.location.href = '/login';
  }
};

/* POST API */
export const postDataApi = async (requestUrl, params) => {
  try {
    const response = await API.post(requestUrl, params);
    return response.data;
  } catch (error) {
    console.error('Error in postDataApi:', error);
    throw error;
  }
};

export const isTokenExpired = () => {
  const accessExpiry = localStorage.getItem('accessExpiry');
  if (!accessExpiry) return true;

  return new Date(accessExpiry) < new Date();
};

/* GET API */
export const getListByApi = async (requestUrl, params) => {
  try {
    const response = await API.get(requestUrl, { params });
    return response.data;
  } catch (error) {
    console.error('Error in getListByApi:', error);
    throw error;
  }
};

/* GET - ViewData API */
export const viewDataByApi = async (requestUrl, dataId) => {
  try {
    const response = await API.get(`${requestUrl}/${dataId}`);
    return response.data;
  } catch (error) {
    console.error('Error in viewDataByApi:', error);
    throw error;
  }
};

/* PUT API */
export const putDataApi = async (
  requestUrl,
  params,
  id,
  roleId,
  designation,
  method
) => {
  try {
    let getParams = '';
    if (roleId) getParams += `/${roleId}`;
    if (designation) getParams += `?designation=${designation}`;
    if (method) getParams += `&method=${method}`;

    const response = await API.put(`${requestUrl}/${id}${getParams}`, params);
    return response.data;
  } catch (error) {
    console.error('Error in putDataApi:', error);
    throw error;
  }
};

export const normalPutDataApi = async (requestUrl, params, id) => {
  try {
    const response = await API.put(`${requestUrl}`, params);
    return response.data;
  } catch (error) {
    console.error('Error in putDataApi:', error);
    throw error;
  }
};


/* PATCH API */
export const patchDataApi = async (requestUrl, params) => {
  try {
    const response = await API.patch(requestUrl, params);
    return response.data;
  } catch (error) {
    console.error('Error in patchDataApi:', error);
    throw error;
  }
};

/* PATCH - PatchFormData API */
export const patchFormDataApi = async (requestUrl, formData) => {
  try {
    const response = await API.patch(requestUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error in patchFormDataApi:', error);
    throw error;
  }
};

/* DELETE API */
export const deleteDataApi = async (requestUrl) => {
  try {
    const response = await API.delete(`${requestUrl}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteDataApi:', error);
    throw error;
  }
};

/* DELETE - DeleteUserData API */
export const deleteUserDataApi = async (requestUrl) => {
  try {
    const response = await API.delete(`${requestUrl}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteUserDataApi:', error);
    throw error;
  }
};

/* GET - Download API */
export const downloadApi = async (requestUrl, dataId) => {
  try {
    const response = await API.get(`${requestUrl}?candidateId=${dataId}`, {
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    console.error('Error in downloadApi:', error);
    throw error;
  }
};

/* POST - PostForm API */
export const postFormApi = async (requestUrl, params) => {
  try {
    const response = await API.post(requestUrl, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error in postFormApi:', error);
    throw error;
  }
};

