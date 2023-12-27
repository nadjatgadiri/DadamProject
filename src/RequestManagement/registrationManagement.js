import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

// Function to add a new registration
export const addNewRegistration = async (registrationData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/registration/add', { // Assuming the endpoint is /registrations/add
            "data": registrationData
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to add registration:", error);
        throw error;
    }
};

// Function to remove a registration
export const deleteRegistration = async (registrationId) => {
    try {
        setReqHeader();
        const response = await axios.delete(`/protected/registration/remove/${registrationId}`);
        reloadOn501(response.data);

        return response.data;
    } catch (error) {
        console.error("Failed to delete registration:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};

// Function to fetch all registrable programs
export const getRegistrablePrograms = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/program/registrable'); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        reloadOn501(data);

        return data;
    } catch (error) {
        console.error("Failed to list registrable programs:", error);
        throw error;
    }
};
export const getAllRegistrations = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/registration/list');
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch the list of registrations:", error);
        throw error;
    }
};

export const getProgRegistrations = async (progId) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/registration/programmeListRegestarion', {
            "progId": progId
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch the list of registrations:", error);
        throw error;
    }
};

export const updateRegestraion = async (sendData) => {
    try {
        setReqHeader();
        console.log(sendData)
        const response = await axios.post('/protected/registration/updateRegistrationGroup', {
            "data": sendData
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch the list of registrations:", error);
        throw error;
    }
};

export const affectation = async (sendData) => {
    try {
        setReqHeader();
        console.log(sendData)
        const response = await axios.post('/protected/registration/affectation', {
            "data": sendData
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch the list of registrations:", error);
        throw error;
    }
};