import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

// Function to fetch all groupes
export const getProgGroups = async (progId) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/groupe/listProgrammeGroups', {
            "progId": progId
        }); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to list groupes:", error);
        throw error;
    }
};

export const getGroups = async () => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/groupe/listGroups'); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to list groupes:", error);
        throw error;
    }
};
export const addGroupe = async (body) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/groupe/add', {
            "data": body
        }); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to add groupe:", error);
        throw error;
    }
};

export const updateGroupe = async (body, groupId) => {
    try {
        setReqHeader();
        const response = await axios.put(`/protected/groupe/update/${groupId}`, {
            "data": body
        }); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to add groupe:", error);
        throw error;
    }
};
export const deleteGroupe = async (groupId) => {
    try {
        const response = await axios.delete(`/protected/groupe/remove/${groupId}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};