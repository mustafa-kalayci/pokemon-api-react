import { createContext, useEffect, useReducer, useState } from "react";
import PokeReducer from "./PokeReducer";

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const initialState = {
    pokemons: { results: [] },
    pokemonList: [],
    pokemon: [],
    allPokemons: [],
    loading: true,
  };
  const [state, dispatch] = useReducer(PokeReducer, initialState);
  // Load More Pokemon
  const loadMorePokemons = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${state.pokemons.results.length}`
      );
      const data = await response.json();
      const newData = [];
      for (let i = 0; i < data.results.length; i++) {
        const pokemonResponse = await fetch(data.results[i].url);
        const pokemonData = await pokemonResponse.json();
        newData.push(pokemonData);
      }

      dispatch({ type: "LOAD_MORE_POKEMONS", payload: { results: newData } });
    } catch (error) {
      console.log(error);
    }
  };
  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };

  //Get Single Pokemon
  const getPokemon = async (name) => {
    setLoading(true);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    dispatch({
      type: "GET_POKEMON",
      payload: data,
    });
    setLoading(false);
  };

  // Search Pokemons
  const searchPokemon = async (text) => {
    const params = new URLSearchParams({
      q: text,
    });
    const response = await fetch(
      `${process.env.POKEMON_API_URL}/pokemon/${params}`
    );
    const data = await response.json();
    dispatch({
      type: "GET_POKEMON",
      payload: data,
    });
    setLoading(false);
  };

  const getPokemons = async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
    const data = await response.json();
    const pokemonDetails = [];
    for (const pokemon of data.results) {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonResponse.json();
      pokemonDetails.push(pokemonData);
    }
    const goNextPage = await fetch(data.next);
    const nextData = await goNextPage.json();
    for (const next of nextData.results) {
      const nextResponse = await fetch(next.url);
      const nextData = await nextResponse.json();
      pokemonDetails.push(nextData);
    }
    const allPokemonData = {
      ...data,
      results: pokemonDetails,
    };

    dispatch({
      type: "GET_POKEMONS",
      payload: allPokemonData,
    });
    setLoading();
  };
  // Load More

  return (
    <PokemonContext.Provider
      value={{
        pokemons: state.pokemons,
        pokemon: state.pokemon,
        loading: state.loading,
        pokemonList: state.pokemonList,
        searchPokemon,
        getPokemons,
        setLoading,
        loadMorePokemons,
        getPokemon,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonContext;