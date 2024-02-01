const ssoTedbReadApiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjA3NGE3ZjBhMWZhOTllOThlMGVjZWJmODdkZDNmZCIsInN1YiI6IjY1YWZjMDdmYWFkOWMyMDEwOTA0NzQ1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hqpwUyMkWou5v8500grCh-nx1iLOtZpJlOFKCDK5Gq8"
const Bouttonseconnecter = document.querySelector(".connect")

window.onload = async () =>{
    if(!location.search.includes("request_token=")){
    return
    }

    let token = location.search.split("request_token=")[1]?.split("&")?.[0]

    if(token){

        getNewSession(token)
        .then(sessionData =>{
            sessionStorage.setItem("tmdbSessionId",sessionData.session_id)
            sessionStorage.setItem("tmdbAccessToken", token)
            location.href = "http://127.0.0.1:5500"
            console.log(sessionData.session_id)
        })
        .catch(err =>{
            console.error("error",err);
            //location.href = "http://127.0.0.1:5500"
        })

    }
}

async function getNewTMDBToken(){
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ssoTedbReadApiKey}`
        }
    };
    
    let tokenRequest = await fetch('https://api.themoviedb.org/3/authentication/token/new', options).catch(err => console.error("error:" + err));
    let tokenData = await tokenRequest.json()
    console.log(tokenData)

    return tokenData;
}

async function redirectUserToSSD(){
    let tokenData = await getNewTMDBToken()
    if (!tokenData.success){
        return alert("Une erreur est survenue et je peux pas vous identifier")
    }
    location.href = `https://www.themoviedb.org/authenticate/${tokenData.request_token}?redirect_to=http://127.0.0.1:5500`
    console.log(tokenData.request_token)
}



async function getNewSession(token) {
    const options ={
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
async function getPopularFilm(){
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ssoTedbReadApiKey}`
    }
  };
  
    let FilmP = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
    let FilmPData = await FilmP.json()
    console.log(FilmPData.results[0].poster_path)
    return FilmPData
}
async function affichPopular(){
    let FilmPData = await getPopularFilm()
    console.log(FilmPData)
    const FilmDatamap = FilmPData.results.map(element => element.poster_path)
    const FilmDatamaptext = FilmPData.results.map(element => element.original_title)
    const FilmDatamapDate = FilmPData.results.map(element => element.release_date)
    let compteur = 0
    
    FilmDatamap.forEach((element) => {
        const posterAccueil = document.createElement("img")
        posterAccueil.src = `https://media.themoviedb.org/t/p/w220_and_h330_face/${element}`
        document.getElementById("emplacementPoster").appendChild(posterAccueil)
        
        const titreAccueil = document.createElement("p")
        titreAccueil.textContent = FilmDatamaptext[compteur]
        
        const DateAccueil = document.createElement("p")
        DateAccueil.textContent = FilmDatamapDate[compteur]
        
        document.getElementById("emplacementPoster").appendChild(titreAccueil)
        document.getElementById("emplacementPoster").appendChild(DateAccueil)
        
        compteur ++
});
    
}

affichPopular()