function callApi(url, bodyObject) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  })
  .then(response => response.json())
  .catch(error => {
    console.error('Error fetching data:', error);
    throw error;
  });
}
  
export {callApi}