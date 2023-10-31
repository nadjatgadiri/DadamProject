import axios from 'axios';
import setReqHeader from './headerSetup';

export const addNewTeacher = async (teacherData) => {
    try {
        setReqHeader();
        const response = await axios.post('/teachers/addTeacher', {
            "data": teacherData
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateTeacherData = async (teacherId, updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/teachers/modify/${teacherId}`, {
            "data": updatedData
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteTeacher = async (teacherId) => {
    try {
        const response = await axios.delete(`/teachers/remove/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete teacher:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};
export const getAllTeachers = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/teachers/list');
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const listTeachersForGroup = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/teachers/listTeachersForGroup');
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};