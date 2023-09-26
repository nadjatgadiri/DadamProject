import axios from 'axios';
import setReqHeader from './headerSetup';

export const getAllSalles = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/class/listSalles');
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addNewSalle = async (salleData) => {
    try {
        setReqHeader();
        const response = await axios.post('/class/addSalle', {
            "data": salleData
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const updateSalleData = async (id, updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/class/updateSalle/${id}`, {
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
export const deleteSalle = async (id) => {
    try {
        const response = await axios.delete(`/class/removeSalle/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete class:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};