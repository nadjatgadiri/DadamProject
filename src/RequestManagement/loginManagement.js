import Cookies from 'js-cookie';
import axios from 'axios';
import setReqHeader from './headerSetup';
import { reloadOn501 } from './reloadBrouser'; // Replace './yourFile.js' with the correct path

export const logIn = async (username, password) => {
  try {
    setReqHeader();
    const response = await axios.post('/connexion/UserlogIn', {
      userLog: username,
      psw: password,
    });

    const data = response.data;
    reloadOn501(data);
    if (data.code === 200) {
      Cookies.set('token', data.token, { expires: 15 }); // Set an expiration date (in days)
      Cookies.set('is-active', true, { expires: 15 });
      Cookies.set('userID', data.userID, { expires: 15 });
      Cookies.set('role', 'Worker', { expires: 15 });
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const logInEns = async (username, password) => {
  try {
    setReqHeader();
    const response = await axios.post('/connexion/UserlogInEns', {
      userLog: username,
      psw: password,
    });

    const data = response.data;
    reloadOn501(data);
    if (data.code === 200) {
      Cookies.set('token', data.token, { expires: 15 }); // Set an expiration date (in days)
      Cookies.set('is-active', true, { expires: 15 });
      Cookies.set('userID', data.userID, { expires: 15 });
      Cookies.set('role', 'Enseignant', { expires: 15 });
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
