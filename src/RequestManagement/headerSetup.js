import axios from 'axios';

const setReqHeader = () => {

    const token = sessionStorage.getItem('token');
    const isActive = sessionStorage.getItem('is-active');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (isActive) {
        headers['is-active'] = isActive;
        headers.authorization = token;
    }
    axios.defaults.headers.common = headers;
};

export default setReqHeader;
