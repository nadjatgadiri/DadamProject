import axios from 'axios';
import setReqHeader from './headerSetup';

export const addNewPrograme = async (dataProgram, dataType) => {
    try {
        setReqHeader();

        const response = await axios.post('/program/addProgram', {
            "dataProgram": dataProgram,
            "dataType": dataType
        });
        console.log(response);
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const updatePrograme = async (id, dataProgram, dataType) => {
    try {
        setReqHeader();

        const response = await axios.put(`/program/updateProgram/${id}`, {
            "dataProgram": dataProgram,
            "dataType": dataType
        });
        console.log(response);
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getAllProgrammes = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/program/listProgram');
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const deleteProgramme = async (progID) => {
    try {
        const response = await axios.delete(`/program/removeProgram/${progID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete the programme:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};
export const getProgramme = async (progID) => {
    try {
        const response = await axios.get(`/program/getProgram/${progID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetsh the programme:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};