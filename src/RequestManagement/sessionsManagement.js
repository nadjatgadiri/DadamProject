import axios from 'axios';
import setReqHeader from './headerSetup';

export const getAvailableSessions = async (daysData) => {
    try {
        setReqHeader();
        const response = await axios.post('/session/getAvailableData', {
            "data": daysData
        });
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addSessions = async (selectedSessions) => {
    try {
        setReqHeader();
        const response = await axios.post('/session/addSessions', {
            "dataSessions": selectedSessions
        });
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllSessionsInProg = async (idProg) => {
    try {
        setReqHeader();
        const response = await axios.post('/session/getAllSessionsInProg', {
            "idProg": idProg
        });
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteSession = async (idSession) => {
    try {
        setReqHeader();
        const response = await axios.post('/session/deleteSession', {
            "idSession": idSession
        });
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllSessionsInSalle = async (idSalle) => {
    try {
        setReqHeader();
        const response = await axios.post('/session/getAllSessionsForSalle', {
            "idSalle": idSalle
        });
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};