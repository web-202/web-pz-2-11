const loadData = async (url) => {
 return fetch(url)
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
