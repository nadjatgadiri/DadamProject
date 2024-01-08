import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getSchoolData = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/webSite/getSchoolData');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getPrincipaleCategories = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/webSite/getPrincipaleCategories');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getLatestPrograms = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/webSite/getLatestPrograms');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const listCategories = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/webSite/listCategories');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const listCategoriesForSpecificOpenMainCategory = async (catID) => {
    try {
        setReqHeader();
        const response = await axios.post('/webSite/listCategoriesForSpecificOpenMainCategory', {
            "idMainCat": catID
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getProgramsForCat = async (categID) => {
    try {
        setReqHeader();
        const response = await axios.post('/webSite/getProgramsForCat', {
            "categID": categID
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getPrograms = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/webSite/getPrograms');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getProgram = async (id) => {
    try {
        setReqHeader();
        const response = await axios.post('/webSite/getProgram', {
            'id': id
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const getCatPath = async (catID) => {
    try {
        setReqHeader();
        const response = await axios.post('/webSite/catPath', {
            "catID": catID
        });
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};