import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getStatistiqueDataForProgProfile = async (idProg) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/static/getStatistiqueDataForProgProfile', {
            progID: idProg
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStatistiqueDataForDashbaord1 = async () => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/static/getStatistiqueDataForDashbaord1');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.log(error);
        throw error;
    }
};