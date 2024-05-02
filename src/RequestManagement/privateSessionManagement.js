import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const addPrivateSessions = async (session) => {
  try {
    setReqHeader();
    const response = await axios.put('/protected/privateSession/addPrivateSession', {
      data: session,
    });
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePrivateSessions = async (session) => {
  try {
    setReqHeader();
    const response = await axios.put('/protected/privateSession/updatePrivateSession', {
      data: session,
    });
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePrivateSession = async (idSession) => {
  try {
    setReqHeader();
    const response = await axios.post('/protected/privateSession/deletePrivateSession', {
      idSession,
    });
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPrivateSessionAttendanceRecording = async (id) => {
  try {
    setReqHeader();
    const response = await axios.get(
      `/protected/privateSession/getPrivateSessionAttendanceRecording/${id}`
    );
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePrivateSessionAttendanceRecording = async (id, updatedData) => {
  try {
    setReqHeader();
    const response = await axios.put(
      `/protected/privateSession/updatePrivateSessionAttendanceRecording/${id}`,
      {
        data: updatedData,
      }
    );
    const data = response.data;
    reloadOn501(data);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
