import Cookies from 'js-cookie';

export function reloadOn501(response) {
  if (response.code === 501) {
    // Clear localStorage
    Cookies.remove('userID');
    Cookies.remove('is-active');
    Cookies.remove('userID');
    Cookies.remove('role');
    window.location.reload(true);

    // Execution stops here after reloading the page and clearing localStorage
    throw new Error('Execution stopped due to status code 501');
  }
}
