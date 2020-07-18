const SearchModes = Object.freeze({
	MATCH_STRING: 'MATCH_STRING',
	FIT_RANGE: 'FIT_RANGE'
})

class Search {

	/**
	 * Constructor
	 * @param searchStr {String} Raw source search string provided by the client
	 */
	constructor (searchStr) {
		this.raw = searchStr
		this.components = Search.parseInputString(this.raw)
	}

	/**
	 * Get a map mapping values in the query to their parameters to be used in the SQL query.
	 * @see getParamArray
	 * @return {{}} Map where the key is the input value, and the value is the SQL parameter $#
	 */
	getParamMap () {
		const arr = this.getParamArray()
		const arrToMap = {}

		for(let i = 0; i < arr.length; i++) {
			arrToMap[arr[i]] = i + 1
		}

		return arrToMap
	}

	/**
	 * Get an array containing the values in the query ordered in the way they should be parameterized
	 * in the SQL query. This array can be expanded and fed to the query parameter list directly.
	 * @see getParamMap
	 * @return {[]} Array of ordered input parameter values.
	 */
	getParamArray() {
		let paramCount = 0
		const arr = []
		for(let i = 0; i < this.components.length; i++) {
			if (this.components[i].mode === SearchModes.MATCH_STRING) {
				const val = Search._escapeRegex(this.components[i].value)
				// Skip values already with a param
				if (arr.includes(val)) {
					continue
				}
				paramCount++
				arr.push(val)
			} else if (this.components[i].mode === SearchModes.FIT_RANGE) {
				const min = this.components[i].min
				// Skip values already with a param
				if (!arr.includes(min)) {
					paramCount++
					arr.push(min)
				}
				const max = this.components[i].max
				// Skip values already with a param
				if (!arr.includes(max)) {
					paramCount++
					arr.push(max)
				}
			}
		}

		return arr
	}

	/**
	 * Build the search components into a SQL 'WHERE' clause.
	 * @param cols {[{name: String, type: Object}]} Columns which should be searched.
	 * @return {String} WHERE clause to be fed to the database.
	 */
	buildSQL (cols) {
		let clause = ''
		const map = this.getParamMap()

		const optionalRangeSegment = this._buildFitRangeComponent(cols, map, false)
		const requiredRangeSegment = this._buildFitRangeComponent(cols, map, true)
		const optionalStringSegment = this._buildMatchStringsComponent(cols, map, false)
		const requiredStringSegment = this._buildMatchStringsComponent(cols, map, true)

		// Return empty string if none exist
		if (!optionalRangeSegment && !requiredRangeSegment && !optionalStringSegment && !requiredStringSegment) {
			return ''
		}

		// Start with WHERE
		clause += 'WHERE '

		let optionalSegment = ''
		// Append optional range, if it exists.
		if (optionalRangeSegment) {
			optionalSegment += optionalRangeSegment
			// If both optional clauses exist, append ' OR ' in between them
			if (optionalStringSegment) {
				optionalSegment += ' OR '
			}
		}
		// Append optional string, if it exists.
		if (optionalStringSegment) {
			optionalSegment += optionalStringSegment
		}

		// If either optional string or optional range exist, wrap in parentheses, in case we combine with required
		if (optionalSegment) {
			optionalSegment = '(' + optionalSegment + ')'
			clause += optionalSegment
		}

		let requiredSegment = ''
		// Append required range, if it exists.
		if (requiredRangeSegment) {
			requiredSegment += requiredRangeSegment
			// If both required clauses exist, append ' AND ' in between them
			if (requiredStringSegment) {
				requiredSegment += ' AND '
			}
		}
		// Append required string, if it exists.
		if (requiredStringSegment) {
			requiredSegment += requiredStringSegment
		}

		// If both optional and required segments exist, append ' AND ' in between them
		if(optionalSegment && requiredSegment) {
			clause += ' AND '
		}
		clause += requiredSegment

		return clause
	}

	_buildFitRangeComponent(cols, paramsMap, required) {
		let piece = ''
		let joinedPieces = 0
		// For each column, add it's options
		for(let i = 0; i < cols.length; i++) {
			// Skip columns which are not numbers
			if (cols[i].type !== Number) {
				continue
			}
			for (let j = 0; j < this.components.length; j++) {
				// Skip components which do not match the current required state
				if (!!this.components[j].required !== !!required) {
					continue
				}
				// Skip components which do not apply to this scope
				if (this.components[j].scope && this.components[j].scope !== cols[i].name) {
					continue
				}
				// Skip components which are not FIT_RANGE mode
				if(this.components[j].mode !== SearchModes.FIT_RANGE) {
					continue
				}

				const min = '$' + paramsMap[this.components[j].min]
				const max = '$' + paramsMap[this.components[j].max]

				if(joinedPieces++ > 0) {
					piece += (required ? ' AND ' : ' OR ')
				}
				piece += cols[i].name + ' BETWEEN ' + min + ' AND ' + max // Append escaped input parameters
			}
		}
		return piece
	}

	_buildMatchStringsComponent(cols, paramsMap, required = false) {

		let piece = ''
		let addedPieces = 0
		// For each column, add it's options
		for(let i = 0; i < cols.length; i++) {
			let subpiece = ''
			if (addedPieces > 0) { // Append 'OR' for all but first
				subpiece += (required ? ' AND ' : ' OR ')
			}
			let addedParams = 0
			subpiece += cols[i].name + '::text~*concat(' // append colName, regex match symbol, opening quote
			for (let j = 0; j < this.components.length; j++) {
				// Skip components which do not match the current required state
				if (!!this.components[j].required !== !!required) {
					continue
				}
				// Skip components which do not apply to this scope
				if (this.components[j].scope && this.components[j].scope !== cols[i].name) {
					continue
				}
				// Skip components which are not MATCH_STRING mode
				if(this.components[j].mode !== SearchModes.MATCH_STRING) {
					continue
				}

				const param = '$' + paramsMap[Search._escapeRegex(this.components[j].value)] + '::text'
				if (addedParams++ > 0) {
					subpiece += ',\'|\',' // Pre-append OR symbol, if not the first item
				}
				subpiece += param // Append escaped input parameter
			}
			subpiece += ')' // Append closing quote
			if(addedParams > 0) {
				piece += subpiece
				addedPieces++
			}
		}
		return piece
	}

	/**
	 * Get the total count of components in this search
	 * @return {number} Number of components in this search
	 */
	count () {
		if (!this.components || typeof this.components.length != 'number') {
			return 0
		}
		return this.components.length
	}

	/**
	 * Combines the methods {@link Search._removeArtifacts}, {@link Search._parseModes},
	 * {@link Search._parseScopes}, and {@link Search._split} in the correct order.
	 * @param str {String} Input raw search string
	 * @return {Array} Array of fully parsed components
	 */
	static parseInputString (str) {
		if (!str) {
			return []
		}
		return Search._removeArtifacts(
			Search._parseModes(
				Search._parseScopes(
					Search._split(str)
				)
			)
		)
	}

	/**
	 * Helper function for {@link Search.parseInputString}
	 * Split the provided string into its search components
	 * Notably, this function creates a components array and sets each value. It does not extract
	 * extra metadata from the values. See {@link _parseModes} and {@link _parseScopes} for that.
	 * @param src {String} Source string. Should be a non-null String object.
	 * @return {Array} The components array
	 */
	static _split (src) {
		src = src + ' '
		let components = []

		let isInQuotes = false
		let endOfLastComponent = -1
		for (let i = 0; i < src.length; i++) {
			switch (src[i]) {
				case ' ': // Split into new component, unless in quotes
					if (isInQuotes) {
						break;
					}
					let newComponent = {
						value: src.slice(endOfLastComponent + 1, i)
					}
					endOfLastComponent = i
					newComponent.value = newComponent.value.trim()

					const length = newComponent.value.length
					if (length === 0) { // Skip empty values
						break;
					}

					// Set required state - if value is appended with non-escaped exclamation point
					if(length > 1 && newComponent.value[length-1] === '!' && newComponent.value[length-2] !== '\\') {
						newComponent.required = true
						newComponent.value = newComponent.value.slice(0, -1) // Remove exclamation point
					}
					components.push(newComponent)
					break;
				case '"': // Swap isInQuotes state
					if (i > 0 && src[i-1] === '\\') { // Skip escaped quotes
						break;
					}
					isInQuotes = !isInQuotes
					break;
			}
		}

		return components
	}

	/**
	 * Helper function for {@link Search.parseInputString}
	 * Inspects all search components and extracts the scope for each one.
	 * If a component does not have a specified scope, then the scope is assumed global.
	 * Modifies the passed array's content by adding a 'scope' property to those which it is applicable.
	 * @param splitResult {Array} Returned result from {@link Search._split}.
	 * @returns {Array} The passed array.
	 */
	static _parseScopes (splitResult) {
		for(let i = 0; i < splitResult.length; i++) {
			// Skip items already w/ a scope
			if (splitResult[i].scope) {
				continue
			}
			// Skip items which don't match the word:ANYTHING syntax
			// This should inherently skip items surrounded by quotes and items with an escaped colon.
			const parsed = splitResult[i].value.match(/^(\w+):(.+)$/)
			if (!parsed || parsed.length !== 3) {
				continue
			}
			splitResult[i].scope = parsed[1]
			splitResult[i].value = parsed[2]
		}
		return splitResult
	}

	/**
	 * Helper function for {@link Search.parseInputString}
	 * Inspects all search components and extracts the search mode for each one.
	 * Default search mode is {@link SearchModes.MATCH_STRING}. {@link SearchModes.FIT_RANGE} is used when
	 * a numeric range is passed as the value, in the form of /^(\d+)-(\d+)$/.
	 * Modifies the passed array's content by adding a 'mode' property to each element. In the case of
	 * {@link SearchModes.FIT_RANGE} elements, min and max properties are added as well.
	 * @see SearchModes
	 * @param scopeResult {Array} Returned result from {@link Search._parseScopes}.
	 * @returns {Array} The passed array.
	 */
	static _parseModes (scopeResult) {
		for(let i = 0; i < scopeResult.length; i++) {
			if (scopeResult[i].mode) {
				continue
			}
			let matched = scopeResult[i].value.match(/^(\d+)-(\d+)$/)
			if (matched) {
				scopeResult[i].mode = SearchModes.FIT_RANGE
				scopeResult[i].min = parseInt(matched[1])
				scopeResult[i].max = parseInt(matched[2])
			} else {
				scopeResult[i].mode = SearchModes.MATCH_STRING
			}
		}
		return scopeResult
	}

	/**
	 * Helper function for {@link Search.parseInputString}
	 * Modifies the value of each component to remove non-escaped quotes and remove the backslash for escaped
	 * characters.
	 * Modifies the passed array's content by altering the 'value' property of each element.
	 * @param components {Array} Returned result from {@link Search._parseModes}.
	 * @returns {Array} The passed array.
	 */
	static _removeArtifacts (components) {
		for(let i = 0; i < components.length; i++) {
			const comp = components[i].value
			comp.replace(/(?<!\\)"/, '') // Replace " with empty string
			// Replace escaped characters with their non-escaped version
			comp.replace(/\\(.)/g, '$1')
		}
		return components
	}

	/**
	 * Escape a string of any regex special characters
	 * @param regex {String} Input untrusted string
	 * @return {String} Input string with regex special characters escaped
	 */
	static _escapeRegex (regex) {
		return regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}


}

module.exports = { Search, SearchModes }
