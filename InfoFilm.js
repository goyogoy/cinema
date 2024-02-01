const ssoTedbReadApiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjA3NGE3ZjBhMWZhOTllOThlMGVjZWJmODdkZDNmZCIsInN1YiI6IjY1YWZjMDdmYWFkOWMyMDEwOTA0NzQ1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hqpwUyMkWou5v8500grCh-nx1iLOtZpJlOFKCDK5Gq8"
let MovieID = location.search.split("FilmID=")[1]?.split("&")?.[0]
async function getInfoFilm(){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${ssoTedbReadApiKey}`
        }
      };
        

        let infoFilm = await fetch(`https://api.themoviedb.org/3/movie/${MovieID}?language=en-US`, options).catch(err => console.error("error:" + err));
        let infoFilmData = await infoFilm.json()
        return infoFilmData
}

async function affichInfoFilm(){
    let infoFilmData = await getInfoFilm()

    console.log(MovieID)
    document.getElementById('poster').src = `https://media.themoviedb.org/t/p/w220_and_h330_face/${infoFilmData.poster_path}`
    document.getElementById('Titre').textContent = `${infoFilmData.original_title}`
    document.getElementById('résumé').textContent = `${infoFilmData.overview}`
}
async function getReview(){
    const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ssoTedbReadApiKey}`
    }
  };
  
    let reviewFilm = await fetch(`https://api.themoviedb.org/3/movie/${MovieID}/reviews?language=en-US&page=1`, options).catch(err => console.error("error:" + err));
    let reviewFilmData = await reviewFilm.json()
    console.log(reviewFilmData)
    return reviewFilmData
}

async function affichReview(){
    let reviewFilmData = await getReview()
    console.log(reviewFilmData)
}
affichReview()
affichInfoFilm()