import React, { useState } from 'react';
import { MyResponsiveHeatMap } from './ResponsiveHeatMap';
import Autosuggest, {ChangeEvent, SuggestionSelectedEventData} from 'react-autosuggest';

import './App.css';
import { theme } from './autosuggestTheme';

interface ISuggestion {
  name: string;
  id: string;
}

// const originalSuggestions = [{ "Title": "Friends" },{ "Title": "Foster's Home for Imaginary Friends" },{ "Title": "Friends from College" },{ "Title": "Happy Tree Friends" },{ "Title": "Garfield and Friends" },{ "Title": "Friends with Better Lives" },{ "Title": "Barney & Friends" },{ "Title": "Thomas the Tank Engine & Friends" },{ "Title": "Friends with Benefits" },{ "Title": "Spider-Man and His Amazing Friends"  }] as ISuggestion[];

const App = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedImdbId, setSelectedImdbId] = useState('');

  const onSuggestionsFetchRequested = async (e: any) => {
    if (e.value.length < 3) {
      return;
    }

    const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${e.value}`);
    if (!response.ok) {
      setSuggestions([]);
      return;
    }
    const body = await response.json();
    setSuggestions(body.results);
  }

  const onSuggestionsClearRequested = () => {
    // setSuggestions([]);
  }

  const getSuggestionValue = (suggestion: ISuggestion) => {
    return suggestion.name
  }

  const renderSuggestion = (suggestion: ISuggestion) => {
    return <h4 id={suggestion.id} className='suggestion-item'>{getSuggestionValue(suggestion)}</h4>
  }
  
  const onChange = (_: any, params: ChangeEvent) => {
    setSearchValue(params.newValue);
  }

  const onSuggestionSelected = (_: any, suggestion: SuggestionSelectedEventData<ISuggestion>) => {
    console.log(suggestion, 'clicked')
    setSelectedImdbId(suggestion.suggestion.id);
  }

  const shouldRenderSuggestion = (value: string) => {
    return value.trim().length > 2;
  }

  const inputProps = {
    placeholder: 'Type a series ',
    value: searchValue,
    type: 'search',
    onChange
  };

  return (
    <div className="App">
      <div className="search-label">Search for the show you're watching</div>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        //@ts-ignore
        inputProps={inputProps}
        shouldRenderSuggestions={shouldRenderSuggestion}
        onSuggestionSelected={onSuggestionSelected}
        theme={theme}
        alwaysRenderSuggestions={false}
      />
      {selectedImdbId && <MyResponsiveHeatMap imdbID={selectedImdbId} />}
    </div>
  );
}

export default App;
