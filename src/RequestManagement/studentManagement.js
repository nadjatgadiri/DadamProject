import axios from 'axios';
import setReqHeader from './headerSetup';

export const getAllStudents = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/students/list'); // Adjust this endpoint if it's different for fetching all students
        const data = response.data;
        console.log(data);
        console.log("HELLO");
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const SearchStudents = async (key) => {
    try {
        setReqHeader();
        const response = await axios.get(`/students/find?key=${key}`); // Adjust this endpoint if it's different for searching students
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addNewStudent = async (studentData) => {
    try {
        setReqHeader();
        const response = await axios.post('/students/addStudent', {
            "data": studentData
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudentData = async (studentId, updatedData) => {
    try {
        setReqHeader();
        console.log(studentId);
        const response = await axios.put(`/students/modify/${studentId}`, {
            "data": updatedData  // Sending the updated data
        });
        const data = response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const deleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`/students/remove/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete student:", error);
      return { code: 500, message: "Internal Server Error" };
    }
  };