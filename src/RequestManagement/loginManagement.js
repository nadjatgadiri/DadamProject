import axios from 'axios';
import setReqHeader from './headerSetup';

export const logIn = async (username, password) => {
    try {
        setReqHeader();
        const response = await axios.post('/connexion/UserlogIn', {
            userLog: username,
            psw: password
        });

        const data = response.data;
        if (data.code === 200) {
            await sessionStorage.setItem('token', data.token);
            await sessionStorage.setItem('is-active', true);
            await sessionStorage.setItem('userID', data.userID);
            await sessionStorage.setItem('role', data.userRole);
        };
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }

};