'use strict';

// themoviedb API
const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280"; // 얘는 이미지 포스터를 가져오기 위해 반복 재사용할 url 경로를 저장해놓은 것.
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// initially get fav movies
getMovies(APIURL);

async function getMovies(url){
  const resp = await fetch(url); // resp 는 'response'의 약자. 물론 promise의 response겠지?
  const respData = await resp.json();

  console.log(respData);

  showMovies(respData.results);
}

// 검색 시에도 화면에 show하려는 목적으로 재사용하기 위해 함수로 따로 정의함. 
function showMovies(movies){
  // clear main
  // 검색 등으로 새로운 콘텐츠를 화면에 로드해야 할 때 우선적으로 지워주고 시작할 것.
  main.innerHTML = ''; 

  movies.forEach(movie => {
    // Destructuring
    // const poster_path = movie.poster_path;
    // const title = movie.title;
    // const vote_average = movie.vote_average;
    // 이렇게 길게 할당할 것을 한 줄로 할당해버리는 것임.
    const {poster_path, title, vote_average, overview} = movie;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
      <img
        src="${IMGPATH + poster_path}"
        alt="${title}"
      />
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
      <h3>Overview:</h3>
        ${overview}
      <div>
    `;
    // getClassByRate() 이 함수를 실행시켜 return받은 결과값이 template literals 안에 들어갈 것임.
    // 이런 기법들도 잘 봐뒀다가 나중에 필요할 때 사용할 것.

    main.appendChild(movieEl);
  });
}

function getClassByRate(vote){
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value; 

  if (searchTerm) {
    getMovies(SEARCHAPI + searchTerm); 
    // SEARCHAPI url 끝에 검색어만 붙여서 파라미터로 전달하면 해당하는 JSON 데이터를 getMovies()에서 fetch 해줄거임.

    search.value = ''; // 검색하고 submit하면 검색창은 clear 해줘야지
  }
});
