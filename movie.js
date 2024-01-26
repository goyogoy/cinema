const ssoTedbReadApiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzIxNzJlYmU0YWJhODBmNGU2MzA1OGNlNGVjMWY1MSIsInN1YiI6IjY1YWZjMDdmYWFkOWMyMDEwOTA0NzQ1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-B-55Bp1Mswz0ScfLXmcoEHqIqXG-vSkdxSioG1_VTY"

window.onload = async () =>{
    if(!location.search.includes("request_token=")){
    return
    }

    let token = location.search.split("request_token=")[1]?.split("&")?.[0]

    if(token){
        getNewSession(token)
        .then(sessionData =>{
            sessionStorage.setItem("tmdbSessionId",sessionData.session.id)
            sessionStorage.setItem("tmdbAccessToken", token)
            location.href = "http://127.0.0.1:5500"
        })
        .catch(err =>{
            console.error(err);
            location.href = "http://127.0.0.1:5500"
        })

    }
}

async function redirectUserToSSD(){
    let tokenData = await getNewTMDBToken()
    if (!tokenData.success){
        return alert("Une erreur est survenue et je peux pas vous identifier")
    }
    location.href = `https://www.themoviedb.org/authenticate/${tokenData.request_token}?redirect_to=http://127.0.0.1:5500`
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ssoTedbReadApiKey}`
    }
  };
  
  let tokenRequest = await fetch('https://api.themoviedb.org/3/authentication', options).catch(err => console.error("error:" + err));
  if (!tokenRequest){
    return
  }
  let tokenData = await tokenRequest.json()

  return tokenData;

async function getNewSession(token) {
    const option ={
        method:"POST",
        headers: {
            accept: "application/json",
            Authorization:`Bearer ${ssoTedbReadApiKey}`
        },
        body: JSON.stringify({Request_token: token})
    };

    let sessionRequest = await fetch("https://api.themoviedb.org/3/authentication/session/new", options).catch(err => console.error("error:" + err));
    if (!sessionRequest){
        return
    }

    let sessionData = await sessionRequest.json()

    return sessionData
}