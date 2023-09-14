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