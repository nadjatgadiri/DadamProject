import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const getAllUsers = async () => {
    try {
        setReqHeader();
        const response = await axios.get('/protected/user/getAllUsers');
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }

};
export const addNewUser = async (data) => {
    try {
        setReqHeader();
        const response = await axios.post('/protected/user/addUser', {
            "data": data
        });
        const res = response.data;
        reloadOn501(res);
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }

};
export const SearchUsers = async (key) => {
    try {
        setReqHeader();
        const response = await axios.get(`/protected/user/ExploreSearchUsers?key=${key}`);
        const data = response.data;
        reloadOn501(data);
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }

};
export const updateUserData = async (updatedData) => {
    try {
        setReqHeader();
        const response = await axios.put(`/protected/user/updateGeneralUserData`, {
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

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`/protected/user/removeUser/${userId}`);
        reloadOn501(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { code: 500, message: "Internal Server Error" };
    }
};
export const updatePassword = async (data) => {
    try {
        setReqHeader();
        const response = await axios.put('/protected/user/updatePasword', {
            "data": data
        });
        const data2 = response.data;
        reloadOn501(data2);
        return data2;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const getUser = async (userId) => {
    try {
        setReqHeader();
        const response = await axios.get(`/protected/user//getUserProfile/${userId}`);
        const res = response.data;
        reloadOn501(res);
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }

};
