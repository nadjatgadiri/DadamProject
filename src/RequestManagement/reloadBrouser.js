export function reloadOn501(response) {
  if (response.code === 501) {
    // Clear localStorage
    localStorage.clear();

    // Reload the browser if response status is 501
    window.location.reload(true); // Pass true to force a reload from the server

    // Execution stops here after reloading the page and clearing localStorage
    throw new Error('Execution stopped due to status code 501');
  }
}
