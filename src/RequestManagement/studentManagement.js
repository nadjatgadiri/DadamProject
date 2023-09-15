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
export const addStudent = async (studentData) => {
    try {
        setReqHeader();
        const response = await axios.post('/students', studentData); // Assuming '/students' is the endpoint to add a new student
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};