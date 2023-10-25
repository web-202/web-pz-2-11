const loadData = async (url, requestConfig) => {
 return fetch(url, requestConfig)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Request failed with status: " + response.status);
      }
    })
    .then(function (data) {
      return data
    })
    .catch(function (error) {
      return error
    });
}   


export {loadData}
