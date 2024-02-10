import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getAvailableSessions = async (daysData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/getAvailableData', {
            "data": daysData
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addSessions = async (selectedSessions) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/addSessions', {
            "dataSessions": selectedSessions
        });
        console.log(selectedSessions);
        const data = response.data;
        reloadOn501(data);
        console.log(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllSessionsInProg = async (idProg) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/getAllSessionsInProg', {
            "idProg": idProg
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteSession = async (idSession) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/deleteSession', {
            "idSession": idSession
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllSessionsInSalle = async (idSalle) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/getAllSessionsForSalle', {
            "idSalle": idSalle
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getAllSessions = async () => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/getAllSessions',);
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getAllSessionsForStudent = async (id) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/getAllSessionsForStudent', {
            "id": id
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Add the getAllSessionsForTeacher function
export const getAllSessionsForTeacher = async (id) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/getAllSessionsForTeacher', {
            "id": id
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateSession = async (dataEvent) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/session/updateSession', {
            "data": dataEvent
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};