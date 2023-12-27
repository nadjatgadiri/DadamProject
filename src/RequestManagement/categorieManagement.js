import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getAllCategories = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/categorie/listCategorie');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const selectedListCategories = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/categorie/selectedListCategories');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const addNewCategory = async (catData) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/categorie/addCategorie', {
            "data": catData
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const updateCategoryData = async (catId, updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/protected/categorie/updateCategorie/${catId}`, {
            "data": updatedData  // Sending the updated data
        });
        const data = response.data;
        reloadOn501(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const deleteCategory = async (catId) => {
    try {
        const response = await axios.delete(`/protected/categorie/removeCategorie/${catId}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};