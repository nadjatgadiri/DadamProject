import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getSessionAttendanceRecording = async (id) => {
  try {
    setReqHeader();
    const response = await axios.get(
      `/protected/sessionAttRec/getSessionAttendanceRecording/${id}`
    );
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSessionAttendanceRecording = async (id, updatedData) => {
  try {
    setReqHeader();
    const response = await axios.put(
      `/protected/sessionAttRec/updateSessionAttendanceRecording/${id}`,
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
export const getSessionAttRecForStuent = async (id) => {
  try {
    setReqHeader();
    const response = await axios.get(
      `/protected/sessionAttRec/getSessionAttendanceRecordingForStuent/${id}`
    );
    const data = response.data;
    reloadOn501(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
