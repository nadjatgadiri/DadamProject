import axios from 'axios';
import setReqHeader from './headerSetup';

// Function to fetch all registrable programs
export const getProgGroups = async (progId) => {
    try {
        setReqHeader();
        const response = await axios.post('/groupe/listProgrammeGroups', {
            "progId": progId
        }); // Assuming the endpoint is /programs/registrable
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Failed to list registrable programs:", error);
        throw error;
    }
};