import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const logIn = async (username, password) => {
    try {
        setReqHeader();
        const response = await axios.post('/connexion/UserlogIn', {
            userLog: username,
            psw: password
        });

        const data = response.data;
        reloadOn501(data);
        if (data.code === 200) {
            await localStorage.setItem('token', data.token);
            await localStorage.setItem('is-active', true);
            await localStorage.setItem('userID', data.userID);
            await localStorage.setItem('role', data.userRole);
        };
        return data
    } catch (error) {
        console.error(error);
        throw error;
    }

};