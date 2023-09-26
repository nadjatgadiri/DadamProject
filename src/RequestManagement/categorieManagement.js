import axios from 'axios';
import setReqHeader from './headerSetup';

export const getAllCategories = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/categorie/listCategorie');
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addNewCategory = async (catData) => {
    try {
        setReqHeader();
        const response = await axios.post('/categorie/addCategorie', {
            "data": catData
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const updateCategoryData = async (catId, updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/categorie/updateCategorie/${catId}`, {
            "data": updatedData  // Sending the updated data
        });
        const data = response.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const deleteCategory = async (catId) => {
    try {
        const response = await axios.delete(`/categorie/removeCategorie/${catId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};