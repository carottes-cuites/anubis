module.exports = class Tool {

	static debugBot(id, content, data) {
		if (typeof content !== 'string') {
			console.log(id + " - Data :");
			console.log(content);
		} else {
			console.log(id + " - \"" + content + "\"" + (data != undefined ? " - Data :" : "") );
			if (data != undefined) console.log(data);
		}
	}

	static debug(content, data) {
		this.debugBot("System", content, data);
	}

	/**
	* @param keywords :
	* Use conditions "if-like" : 'wordA && wordB' or 'wordA || wordB'.
	*/
	static containsKeywords (userMessage, keywords) {
		if (Array.isArray(keywords)) {
			var countAlone = 0;
			keywords.forEach(function (keyword) {
				if(keyword.indexOf(" && ") != -1) {
					var andContainer = keyword.split(" && ");
					var countAnd = 0;
					andContainer.forEach(function (andElem) {
						if (userMessage.indexOf(andElem + " ") != -1 || userMessage.indexOf(" " + andElem) != -1) countAnd++;
					});
					return countAnd == andContainer.length;
				} else if (keyword.indexOf(" || ") != -1) {
					var orContainer = keyword.split(" || ");
					var atLeastOne = false;
					orContainer.forEach(function (orElem){
						if (userMessage.indexOf(orElem + " ") != -1 || userMessage.indexOf(" " + orElem) != -1) atLeastOne = true;
					});
					return atLeastOne;
				} else {
					if (userMessage.indexOf(keyword + " ") != -1 || focus.indexOf(" " + keyword) != -1) countIn++;
				}
			});
			return countIn == keywords.length;
		} else {
			return userMessage.indexOf(keywords);
		}
	}
}