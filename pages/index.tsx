import React, { useState } from 'react';
import { MyResponsiveHeatMap } from '../components/ResponsiveHeatMap';
import Autosuggest, {ChangeEvent, SuggestionSelectedEventData} from 'react-autosuggest';
import { theme } from '../components/autosuggestTheme';

interface ISuggestion {
  name: string;
  id: string;
}

const App = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedImdbId, setSelectedImdbId] = useState('');

  const onSuggestionsFetchRequested = async (e: any) => {
    if (e.value.length < 3) {
      return;
    }

    const response = await fetch(`/api/shows/search?q=${e.value}`);
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
      <div className="search-sublabel">And we'll show you a nice heatmap to show you how the ratings progress</div>
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
