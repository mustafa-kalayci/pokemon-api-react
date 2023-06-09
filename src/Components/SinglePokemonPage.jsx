import { useEffect, useRef } from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PokemonContext from "../context/PokeContext";
function SinglePokemonPage({ setShowNavbar }) {
  const { pokemon, getPokemon, clearSinglePokemon } =
    useContext(PokemonContext);
  const params = useParams();
  useEffect(() => {
    getPokemon(params.name);
  }, []);
  const positionRef = useRef(null);
  const navigate = useNavigate();
  const handleGoBack = () => {
    setShowNavbar(true);
    if (positionRef.current) {
      window.scrollto(0, positionRef.current);
    } else {
      navigate(-1);
    }
    clearSinglePokemon();
  };

  return (
    <div className="single-pokemon">
      <div className="img-container">
        <div className="infos">
          <h3 className="poke-header">{pokemon.name}</h3>
        </div>
        <img
          src={pokemon?.sprites?.other?.dream_world.front_default}
          style={{ width: "300px", height: "400px" }}
          className="single-poke-img"
        ></img>
      </div>

      <div className="stats">
        <h4>HP : {pokemon?.stats ? pokemon.stats[0].base_stat : ""}</h4>
        <h4>Attack : {pokemon?.stats ? pokemon.stats[1].base_stat : ""}</h4>
        <h4>Defense : {pokemon?.stats ? pokemon.stats[2].base_stat : ""}</h4>
        <h4>
          Special Attack : {pokemon?.stats ? pokemon.stats[3].base_stat : ""}
        </h4>
        <h4>
          Special Defense : {pokemon?.stats ? pokemon.stats[4].base_stat : ""}
        </h4>
        <h4>Speed : {pokemon?.stats ? pokemon.stats[5].base_stat : ""}</h4>
        <button onClick={handleGoBack} className="cancel-btn">
          Back to search Page
        </button>
      </div>
    </div>
  );
}

export default SinglePokemonPage;
