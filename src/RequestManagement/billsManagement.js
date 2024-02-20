import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getStudentBills = async (id) => {
  try {
    setReqHeader();
    const response = await axios.get(`/protected/Bills/getStudentBills/${id}`);
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUnpaidBills = async (id) => {
  try {
    setReqHeader();
    const response = await axios.get(`/protected/Bills/getUnpaidBills/${id}`);
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const payStudentBillsMultiMode = async (records) => {
  try {
    setReqHeader();
    const response = await axios.post('/protected/Bills/payStudentBillsMultiMode', {
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
