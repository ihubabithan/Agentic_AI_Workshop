// OKR API Service
// Functions to interact with OKR backend endpoints

import API from '../api';

export const submitOKR = async (okrData) => {
  const res = await API.post('/okr/submit', okrData);
  return res.data;
};

export const fetchOKRs = async () => {
  const res = await API.get('/okr');
  return res.data;
};

export const checkIsYourOKR = async (userId) => {
  const res = await API.get(`/okr/check-is-your-okr?userId=${userId}`);
  return res.data;
};

export const fetchOKRsByUser = async (userId) => {
  const res = await API.get(`/okr?userId=${userId}`);
  return res.data;
};

export const fetchOKRById = async (okrId) => {
  const res = await API.get(`/okr`);
  return res.data.find(o => o._id === okrId);
};

export const getPrimaryOKR = async () => {
  const res = await API.get('/okr/primary');
  return res.data;
};

export const getAllOKRs = async () => {
  const res = await API.get('/okr/all');
  return res.data;
};

export const getOKRById = async (id) => {
  const res = await API.get(`/okr/${id}`);
  return res.data;
}; 