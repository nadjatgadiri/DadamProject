import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

// Function to update general school data
export const updateGeneralSchoolData = async (schoolData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/school/updateGeneralData', {
            "data": schoolData
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to update general school data:", error);
        throw error;
    }
};

// Function to get general school data
export const getGeneralSchoolData = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/school/getGeneralData');
        const data = response.data;
        console.log(data);
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch general school data:", error);
        throw error;
    }
};

// Add more functions for other school-related operations as needed
