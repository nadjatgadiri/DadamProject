import axios from 'axios';
import setReqHeader from './headerSetup';

// Function to add a new registration
export const addNewRegistration = async (registrationData) => {
    try {
        setReqHeader();
        const response = await axios.post('/registration/add', { // Assuming the endpoint is /registrations/add
            "data": registrationData
        });
        const data = response.data;
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
        const response = await axios.delete(`/registration/remove/${registrationId}`);
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
        const response = await axios.get('/program/registrable'); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Failed to list registrable programs:", error);
        throw error;
    }
};
export const getAllRegistrations = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/registration/list');
        const data = response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch the list of registrations:", error);
        throw error;
    }
};