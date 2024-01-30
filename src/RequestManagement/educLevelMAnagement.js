import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const listLevelWYearEduc = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/educationLevel/listLevelWYearEduc');
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// add section
export const addEducationLevel = async (levelData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/educationLevel/addEducationLevel', {
            "data": levelData // {lib:"..."}
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStudyYear = async (levelData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/educationLevel/addStudyYear', {
            "data": levelData // {lib:"...",levelID:"id"}
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// update section
export const updateEducationLevel = async (updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/protected/educationLevel/updateEducationLevel`, {
            "data": updatedData
            // {idLevel,lib}
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudyYear = async (updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/protected/educationLevel/updateStudyYear`, {
            "data": updatedData
            // {idYear,lib}
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// delete section
export const removeLevelEduc = async (levelId) => {
    try {
        const response = await axios.delete(`/protected/educationLevel/removeLevelEduc/${levelId}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};

export const removeYearEduc = async (yearId) => {
    try {
        const response = await axios.delete(`/protected/educationLevel/removeYearEduc/${yearId}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete year Study:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};
