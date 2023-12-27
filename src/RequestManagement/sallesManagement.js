import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getAllSalles = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/class/listSalles');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addNewSalle = async (salleData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/class/addSalle', {
            "data": salleData
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const updateSalleData = async (id, updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/protected/class/updateSalle/${id}`, {
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
export const deleteSalle = async (id) => {
    try {
        const response = await axios.delete(`/protected/class/removeSalle/${id}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete class:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};