function getScoresApi(endpoint, token) {
  console.log("start callApi");
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  
  headers.append("Authorization", bearer);
  
  const options = {
    method: "GET",
    headers: headers
  };

  fetch(endpoint, options)
    .then(response => response.json())
    .then(response => {
      if (response) {
        console.log("scores", response);
        scores = response;
        createScoresTable();
      }  
      return response;
    }).catch(error => {
    console.error(error);
  });
}

function sendScoreApi(endpoint, token) {
  console.log("In sendScore");
  const headers = new Headers();
  headers.set("content-type", "application/json");
  const bearer = `Bearer ${token}`;
  headers.append('Authorization', bearer);
  
  var data = {score: x.getScore()};
  const options = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: headers,
    body: JSON.stringify(data)
  };
  console.log("body", options.body);

  fetch(endpoint, options)
    .then(response => {
      if (response) {
        alert("Score saved successfully!")
        console.log("response", response);
      }
      return response;
    }).catch(error => {
      alert(error);
      alert("Failed to save score");
      console.log("failed to save score");
      console.log(error);
    });
}