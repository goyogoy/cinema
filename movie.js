const ssoTedbReadApiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjA3NGE3ZjBhMWZhOTllOThlMGVjZWJmODdkZDNmZCIsInN1YiI6IjY1YWZjMDdmYWFkOWMyMDEwOTA0NzQ1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hqpwUyMkWou5v8500grCh-nx1iLOtZpJlOFKCDK5Gq8"
const Bouttonseconnecter = document.getElementById("connect")
const Bouttonsedéconnecter = document.getElementById("disconnect")
let page = 2
let tokenG

window.onload = async () =>{

    if (localStorage.length < 2 || localStorage.getItem('tmdbSessionId') == 'undefined') {
        hideBouttonDisconnété()
        }else{
        hideBouttonConnété()
        }

    if(!location.search.includes("request_token=")){
    return
    }

    let token = location.search.split("request_token=")[1]?.split("&")?.[0]

    if(token){

        getNewSession(token)
        .then(sessionData =>{
            localStorage.setItem("tmdbSessionId",sessionData.session_id)
            localStorage.setItem("tmdbAccessToken", token)
            location.href = "http://127.0.0.1:5500"
        })
        .catch(err =>{
            console.error("error",err);
            location.href = "http://127.0.0.1:5500"
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

    return tokenData;
}

async function redirectUserToSSD(){
    let tokenData = await getNewTMDBToken()
    if (!tokenData.success){
        return alert("Une erreur est survenue et je peux pas vous identifier")
    }
    location.href = `https://www.themoviedb.org/authenticate/${tokenData.request_token}?redirect_to=http://127.0.0.1:5500`
    tokenG = tokenData.request_token
}



async function getNewSession(tok) {
    const options ={
        method:"POST",
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization:`Bearer ${ssoTedbReadApiKey}`
        },
        body: JSON.stringify({"request_token": tok})
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
  
    let FilmP = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options).catch(err => console.error("error:" + err));
    let FilmPData = await FilmP.json()
    return FilmPData
}
async function affichPopular(){
    let FilmPData = await getPopularFilm()
    const FilmDatamap = FilmPData.results.map(element => element.poster_path)
    const FilmDatamaptext = FilmPData.results.map(element => element.original_title)
    const FilmDatamapDate = FilmPData.results.map(element => element.release_date)
    const FilmDatamapID = FilmPData.results.map(element => element.id)
    let compteur = 0
    
    FilmDatamap.forEach((element) => {
        const posterAccueil = document.createElement("img")
        posterAccueil.src = `https://media.themoviedb.org/t/p/w220_and_h330_face/${element}`

        const ancre = document.createElement("a")
        const lien = `http://127.0.0.1:5500/movie.html?FilmID=${FilmDatamapID[compteur]}&`
        ancre.setAttribute('href',lien)
        ancre.appendChild(posterAccueil)
        document.getElementById("emplacementPoster").appendChild(ancre)
        
        
        const titreAccueil = document.createElement("li")
        titreAccueil.textContent = FilmDatamaptext[compteur]
        
        const DateAccueil = document.createElement("li")
        DateAccueil.textContent = FilmDatamapDate[compteur]
        
        document.getElementById("emplacementPoster").appendChild(titreAccueil)
        document.getElementById("emplacementPoster").appendChild(DateAccueil)
        
        compteur ++
});
    
}

async function infoProfil(){
    const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ssoTedbReadApiKey}`
    }
  };
  
    let profil = await fetch(`https://api.themoviedb.org/3/account/account_id?session_id=${localStorage.tmdbSessionId}`, options).catch(err => console.error("error:" + err));
    let porfilDtata = await profil.json()
    return porfilDtata
}

async function affichInfoProfil(){
    let porfilDtata = await infoProfil()
    const porfilDtataarray = []
    const pushPorfil = porfilDtataarray.push(porfilDtata.avatar.tmdb.avatar_path)
    porfilDtataarray.forEach((element) => {
        const avatarAccueil = document.createElement("img")
        avatarAccueil.src = `https://media.themoviedb.org/t/p/w220_and_h330_face/${element}`
        document.getElementById("emplacementavatar").appendChild(avatarAccueil)
}
)}

async function EnVoirPlus(){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${ssoTedbReadApiKey}`
        }
      };

        let FilmPlus = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, options).catch(err => console.error("error:" + err));
        let FilmPlusData = await FilmPlus.json()

    const FilmDatamap = FilmPlusData.results.map(element => element.poster_path)
    const FilmDatamaptext = FilmPlusData.results.map(element => element.original_title)
    const FilmDatamapDate = FilmPlusData.results.map(element => element.release_date)
    const FilmDatamapID = FilmPlusData.results.map(element => element.id)
    let compteur = 0
    
    FilmDatamap.forEach((element) => {
        const posterAccueil = document.createElement("img")
        posterAccueil.src = `https://media.themoviedb.org/t/p/w220_and_h330_face/${element}`

        const ancre = document.createElement("a")
        const lien = `http://127.0.0.1:5500/movie.html?FilmID=${FilmDatamapID[compteur]}&`
        ancre.setAttribute('href',lien)
        ancre.appendChild(posterAccueil)
        document.getElementById("emplacementPoster").appendChild(ancre)
        
        
        const titreAccueil = document.createElement("li")
        titreAccueil.textContent = FilmDatamaptext[compteur]
        
        const DateAccueil = document.createElement("li")
        DateAccueil.textContent = FilmDatamapDate[compteur]
        
        document.getElementById("emplacementPoster").appendChild(titreAccueil)
        document.getElementById("emplacementPoster").appendChild(DateAccueil)
        
        compteur ++
});
page = page + 1
}

async function Sedéconnécté (){
    localStorage.setItem("tmdbSessionId",undefined)
        localStorage.setItem("tmdbAccessToken",undefined)
        location.href = "http://127.0.0.1:5500"
}

function hideBouttonConnété(){
    Bouttonseconnecter.style.display = "none"
    Bouttonsedéconnecter.style.display = "block"
}

function hideBouttonDisconnété(){
    Bouttonseconnecter.style.display = "block"
    Bouttonsedéconnecter.style.display = "none"
}

affichInfoProfil()
affichPopular()