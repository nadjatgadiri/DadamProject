import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getTeacherSalaires = async (id) => {
  try {
    setReqHeader();
    const response = await axios.get(`/protected/Salaire/getTeacherSalaire/${id}`);
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUnpaidSailare = async (id) => {
  try {
    setReqHeader();
    const response = await axios.get(`/protected/Salaire/getUnpaidSailare/${id}`);
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const payTeacherSalaire = async (records) => {
  try {
    setReqHeader();
    const response = await axios.post('/protected/Salaire/payTeacherSalaire', {
      data: records,
    });
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
