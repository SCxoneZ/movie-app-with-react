// https://api.themoviedb.org/3/search/movie?api_key=edc4b9ba425753e57f18c4c22891a5c0&query=Spider-Man
// https://image.tmdb.org/t/p/w400/path/
const root = document.querySelector('.root');

/*
          <div key={mv.id} className="card">
          <img src={`https://image.tmdb.org/t/p/w400/${mv.poster_path
          }`} alt="#" />
          <div className="details">
            <div className="title">{mv.original_name ? mv.original_name : mv.original_title}</div>
            <div className="date-release">{mv.release_date ? mv.release_date : mv.first_air_date}</div>
            <button>Details</button>
          </div>
        </div>
*/

/*

*/

function App() {

  const [search, setSearch] = React.useState([]);
  const [inpValue, setInpValue] = React.useState('');
  const [movies, setMovies] = React.useState([]);
  const inputEl = React.useRef(null);

  React.useEffect(() => {
    fetch('https://api.themoviedb.org/3/trending/all/day?api_key=edc4b9ba425753e57f18c4c22891a5c0')
      .then(res => res.json())
      .then(data => setMovies(data.results))
      .catch(err => console.log(err))
  }, []);


  return (
    <>
      <section className="input-part">
        <form onSubmit={
          function(e){
            e.preventDefault();
            setInpValue('');
          }
        }>
          <input type="text" placeholder="Enter a Movie Title..." value={inpValue} ref={inputEl} onChange={inputHandler}/>
          <button type="submit" onClick={searchHandler}>Search</button>
        </form>
      </section>
      
       <section className="cards">
        
        {showMovies()}
        
      </section>
      
    </>

  );

  function inputHandler() {
    setInpValue(inputEl.current.value);
  }

  function searchHandler() {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=edc4b9ba425753e57f18c4c22891a5c0&query=${inpValue}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results);
      })
      .catch(err => console.log(err));
  }

  function showMovies() {
    return movies.map(mv => {
      return (
        <div key={mv.id} className="card">
          <img src={`https://image.tmdb.org/t/p/w400/${mv.poster_path}`} alt="#" />
          <div className="details">
            <div className="title">{mv.original_name ? mv.original_name : mv.original_title}</div>
            <div className="date-release">{mv.release_date ? mv.release_date : mv.first_air_date}</div>
            <button onClick={detailsHandler.bind(this, mv.id)}>Details</button>
          </div>
        </div>
      );
    });
  }

  async function detailsHandler(currentId) {
    const fetchingData = await fetch(`https://api.themoviedb.org/3/movie/${currentId}?api_key=edc4b9ba425753e57f18c4c22891a5c0`);
    const data = await fetchingData.json();
    const fetchCredits = await fetch(`https://api.themoviedb.org/3/movie/${currentId}/credits?api_key=edc4b9ba425753e57f18c4c22891a5c0`);
    const credits = await fetchCredits.json();
    const currentIndex = movies.findIndex(mv => {
      return mv.id == currentId;
    });
    const selectedMovie = movies[currentIndex];
    const el = (

      <>
      <button className="close-button" onClick={function(){
        ReactDOM.render(<App/>, root);
      }}>×</button>
      <div className="details-wrapper">
        <img src={`https://image.tmdb.org/t/p/w400/${data.poster_path}`} alt="#"/>
        <div className="movie-title">{data.title}</div>
        <p className="movie-plot">
          {data.overview}
        </p>
        <ul>
          <li>Score: <b>{data.vote_average}</b></li>
          <li>Budget: <b>{data.budget}</b></li>
          <li>Revenue: <b>{data.revenue}</b></li>
          <li>Language: <b>{(function() {
            const spokenLanguages = [];
            for(const language of data.spoken_languages){
              spokenLanguages.push(language.english_name);
            }
            return spokenLanguages.join(', ');
          })()}</b></li>
          <li>Genre: <b>{
            (function () {
              const genres = [];
              for(const genre of data.genres){
                genres.push(genre.name);
              }
              return genres.join(', ');
            })()
          }</b></li>
          <li>Companies: <b>{
            (function () {
              const companies = [];
              for(const company of data.production_companies){
                companies.push(company.name);
              }
              return companies.join(', ');
            })()
          }</b></li>
          <li>Actors:
          <ul className="actors-list">
          {addActorsList()}
          </ul>
          </li>
        </ul>
      </div>
     </>

    );
    function addActorsList() {
     const actors = [];
     for(const actor of credits.cast){
       actors.push(<li key={actor.id}><b>{actor.name}</b> <i>as</i> <b>{actor.character}</b></li>);
     }
     return actors;
    }

    ReactDOM.render(el, root);
  }



}

ReactDOM.render(<App/>, root);
