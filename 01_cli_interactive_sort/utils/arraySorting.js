
export default class arraySorting {
    alphabeticSort(words) {
        const sortedWords = words.sort();
        return sortedWords;
    }

    smallestToBiggest(digits){
        const sortedDigits = digits.sort((a, b) => a - b);
        return sortedDigits;
    }

    biggestToSmallest(digits){
        const sortedDigits = digits.sort((a, b) => b - a);
        return sortedDigits;
    }

    quantitySort(words){
        const sortedWords =  words.sort((a, b) => a.length - b.length);
        return sortedWords;
    }

    uniqueWordsSort(words){
        const sortedWords = words.filter((item, pos) => {
            return words.indexOf(item) === pos;
        });
        return sortedWords;
    }

    uniqueAllSort(words, digits){
        const wordsAndDigits = words.concat(digits);
        const sorted = wordsAndDigits.filter((item, pos) => {
            return wordsAndDigits.indexOf(item) === pos;
        });
        return sorted;
    }
}
