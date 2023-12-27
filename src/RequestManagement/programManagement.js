import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const addNewPrograme = async (dataProgram, dataType) => {
    try {
        setReqHeader();

        const response = await axios.post('/protected/program/addProgram', {
            "dataProgram": dataProgram,
            "dataType": dataType
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const updatePrograme = async (id, dataProgram, dataType) => {
    try {
        setReqHeader();

        const response = await axios.put(`/protected/program/updateProgram/${id}`, {
            "dataProgram": dataProgram,
            "dataType": dataType
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getAllProgrammes = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/program/listProgram');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const deleteProgramme = async (progID) => {
    try {
        const response = await axios.delete(`/protected/program/removeProgram/${progID}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete the programme:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};
export const getProgramme = async (progID) => {
    try {
        const response = await axios.get(`/protected/program/getProgram/${progID}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetsh the programme:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};