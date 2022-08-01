const masterWordList = require ("./words.json");

function evaluateSingleGuess(guess, feedback, wordlist) {

    let greens = {};
    let exactCount = {};
    let minCount = {};
    let notMatch = {};
    for( let i = 0; i < guess.length; i++ ) {
        let letter = guess[i]

        // For green letters: Find all letters where feedback is G
        if( feedback[i] == "G" ) {
            // Collect indices of G for that letter from feedback
            if( greens[letter] == null ) {
                greens[letter] = [i];
            }
            else {
                greens[letter].push(i);
            }
        }

        // For gray letters, determine exact count of letter
        if( feedback[i] == "-" && exactCount[letter] == null ) {
            exactCount[letter] = countOccurrencesInGuess(guess, feedback, letter);
        }

        // Identify can't-match indices (yellow and gray)
        if( ["Y", "-"].includes(feedback[i]) ) {
            if (notMatch[letter] == null) {
                notMatch[letter] = [i];
            }
            else {
                notMatch[letter].push(i);
            }
        }

        // For yellows, know minimum number of occurrences.
        // Only useful if we don't know exact number.
        if (feedback[i] == "Y" && exactCount[letter] == null && minCount[letter] == null ) {
            minCount[letter] = countOccurrencesInGuess(guess, feedback, letter);
        }
    }

    return wordlist.filter(word => {
        // Filter out anything that doesn't have letters in known positions
        for( const letter in greens ) {
            let indices = greens[letter];
            for( const index of indices ) {
                if (word[index] != letter) {
                    return false;
                }
            }
        }

        // Filter out anything that contains letters in bad positions
        for( const letter in notMatch ) {
            let indices = notMatch[letter];
            for( const index of indices ) {
                if (word[index] == letter ) {
                    return false;
                }
            }
        }

        // Filter out anything that doesn't have the right number of each letter
        for( const letter in exactCount) {
            if (countOccurrencesInWord(word, letter) != exactCount[letter] ) {
                return false;
            }
        }
        for( const letter in minCount ) {
            if( countOccurrencesInWord(word, letter) < minCount[letter]) {
                return false;
            }
        }

        return true;
    });
}

function countOccurrencesInGuess(guess, feedback, letter) {
    let occurrences = 0;
    for (let j = 0; j < guess.length; j++) {
        if (guess[j] == letter && ["G", "Y"].includes(feedback[j])) {
            occurrences += 1;
        }
    }
    return occurrences;
}

function countOccurrencesInWord(word, letter) {
    // Hacky way to count occurrences of letter in word
    return word.split(letter).length - 1;
}

function evaluateMultipleGuesses(guesses, feedbacks, wordlist) {
    for( let i = 0; i < guesses.length; i++ ) {
        console.log(`${guesses[i]} is${wordlist.includes(guesses[i]) ? "" : " not"} in the word list`);
        wordlist = evaluateSingleGuess(guesses[i], feedbacks[i], wordlist);
        if( wordlist.length < 25 ) {
            console.log(`Words after guess ${i}: ${wordlist}`);
        }
        else {
            console.log(`Guess ${i} narrowed list to ${wordlist.length} words`);
        }
    }
    
    return wordlist;
}

function wordleReal(guesses, feedbacks) {
    return evaluateMultipleGuesses(guesses, feedbacks, masterWordList.map( a => a.toUpperCase()));
}

module.exports = { evaluateSingleGuess, evaluateMultipleGuesses, wordleReal };

console.log(
    wordleReal(
        ["STORY", "ADIEU", "RALPH", "PRANK", "GRAMP"],
        ["---Y-", "Y----", "YY-Y-", "YGG--", "-GGGG"]
    )
);

