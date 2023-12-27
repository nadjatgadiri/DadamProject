import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const addNewTeacher = async (teacherData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/teachers/addTeacher', {
            "data": teacherData
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateTeacherData = async (teacherId, updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/protected/teachers/modify/${teacherId}`, {
            "data": updatedData
        });
        const data = response.data; reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteTeacher = async (teacherId) => {
    try {
        const response = await axios.delete(`/protected/teachers/remove/${teacherId}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete teacher:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};
export const getAllTeachers = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/teachers/list');
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const listTeachersForGroup = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/teachers/listTeachersForGroup');
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};