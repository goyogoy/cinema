function recherhce(){
    const searchInput = document.getElementById("searchbar").value
    return searchInput
}

async function getRechercher(){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjA3NGE3ZjBhMWZhOTllOThlMGVjZWJmODdkZDNmZCIsInN1YiI6IjY1YWZjMDdmYWFkOWMyMDEwOTA0NzQ1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hqpwUyMkWou5v8500grCh-nx1iLOtZpJlOFKCDK5Gq8'
        }
      };
      
      response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${recherhce()}&include_adult=false&language=en-US&page=1`, options)
        RechercheData = response.json()
        return RechercheData
        
}

async function affichRecherche(){
    const RechercheData = await getRechercher()
    const FilmDatamap = RechercheData.results.map(element => element.poster_path)
    const FilmDatamaptext = RechercheData.results.map(element => element.original_title)
    const FilmDatamapDate = RechercheData.results.map(element => element.release_date)
    const FilmDatamapID = RechercheData.results.map(element => element.id)
    let compteur = 0
    document.getElementById('emplacementPoster').innerHTML = "";
    
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
