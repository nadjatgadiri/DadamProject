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