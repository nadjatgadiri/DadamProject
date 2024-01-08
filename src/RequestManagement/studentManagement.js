import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getAllStudents = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/students/list'); // Adjust this endpoint if it's different for fetching all students
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const SearchStudents = async (key) => {
    try {
        setReqHeader();
        const response = await axios.get(`/protected/students/find?key=${key}`); // Adjust this endpoint if it's different for searching students
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addNewStudent = async (studentData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/students/addStudent', {
            "data": studentData
        });
        const data = response.data;
        reloadOn501(data);
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
        const response = await axios.put(`/protected/students/modify/${studentId}`, {
            "data": updatedData  // Sending the updated data
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const deleteStudent = async (studentId) => {
    try {
        const response = await axios.delete(`/protected/students/remove/${studentId}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete student:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};

export const getStudentHistory = async (id) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/students/getStudentHistory', {
            "id": id
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getStudent = async (id) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/students/getStudent', {
            "id": id
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};