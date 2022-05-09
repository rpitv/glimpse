enum SearchMode {
	MATCH_STRING = 'MATCH_STRING',
	FIT_RANGE = 'FIT_RANGE'
}

type SearchComponent = {
    mode: SearchMode,
    value: string,
    required: boolean
};

class Search {

}

module.exports = { Search, SearchModes: SearchMode }
