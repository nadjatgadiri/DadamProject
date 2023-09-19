import axios from 'axios';
import setReqHeader from './headerSetup';

export const getAllUsers = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/user/getAllUsers');
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }

};
export const addNewUser = async (data) => {
    try {
        setReqHeader();
        const response = await axios.post('/user/addUser', {
            "data": data
        });
        const res = response.data;
        console.log(res);
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }

};
export const SearchUsers = async (key) => {
    try {
        setReqHeader();
        const response = await axios.get(`/user/ExploreSearchUsers?key=${key}`);
        const data = response.data;
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }

};
export const updateUserData = async (updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/user/updateGeneralUserData`, {
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

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`/user/removeUser/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};