import axios from 'axios';
import Cookies from 'js-cookie';

const setReqHeader = () => {
  const token = Cookies.get('token');
  const isActive = Cookies.get('is-active');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (isActive) {
    headers['is-active'] = isActive;
    headers.authorization = token;
  }

  axios.defaults.headers.common = headers;
};

export default setReqHeader;
