import axios from 'axios';
import setReqHeader from './headerSetup';

// Function to fetch all groupes
export const getProgGroups = async (progId) => {
    try {
        setReqHeader();
        const response = await axios.post('/groupe/listProgrammeGroups', {
            "progId": progId
        }); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Failed to list groupes:", error);
        throw error;
    }
};

export const getGroups = async () => {
    try {
        setReqHeader();
        const response = await axios.post('/groupe/listGroups'); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Failed to list groupes:", error);
        throw error;
    }
};
export const addGroupe = async (body) => {
    try {
        setReqHeader();
        const response = await axios.post('/groupe/add', {
            "data": body
        }); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Failed to add groupe:", error);
        throw error;
    }
};

export const updateGroupe = async (body, groupId) => {
    try {
        setReqHeader();
        const response = await axios.put(`/groupe/update/${groupId}`, {
            "data": body
        }); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Failed to add groupe:", error);
        throw error;
    }
};
export const deleteGroupe = async (groupId) => {
    try {
        const response = await axios.delete(`/groupe/remove/${groupId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};