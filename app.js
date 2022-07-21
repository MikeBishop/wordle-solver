const masterWordList = require ("./words.json");

// Implement your exercise in this file.  If you need to implement additional functions,
// remember to export them as well, if you need to access them in your unit test.
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
            let occurrences = 0;
            for (let j = 0; j < guess.length; j++) {
                if( guess[j] == letter && ["G", "Y"].includes(feedback[j]) ) {
                    occurrences += 1;
                }
            }
            exactCount[letter] = occurrences;
        }

        // Identify can't-match indices
        if( ["Y", "-"].includes(feedback[i]) ) {
            if (notMatch[letter] == null) {
                notMatch[letter] = [i];
            }
            else {
                notMatch[letter].push(i);
            }
        }

        if (feedback[i] == "Y" && exactCount[letter] == null ) {
            let occurrences = 0;
            for (let j = 0; j < guess.length; j++) {
                if (guess[j] == letter && ["G", "Y"].includes(feedback[j])) {
                    occurrences += 1;
                }
            }
            minCount[letter] = occurrences;
        }
    }

    // For yellows, two pieces of data:
    //  - Not in that position
    //  - Minimum number of occurrences
    for (let i = 0; i < guess.length; i++) {
        let letter = guess[i];
    }

    return wordlist.filter(word => {
        for( const letter in greens ) {
            let indices = greens[letter];
            for( const index of indices ) {
                if (word[index] != letter) {
                    return false;
                }
            }
        }
        for( const letter in notMatch ) {
            let indices = notMatch[letter];
            for( const index of indices ) {
                if (word[index] == letter ) {
                    return false;
                }
            }
        }
        for( const letter in exactCount) {
            // Hacky way to count occurrences of letter in word
            if( (word.split(letter).length - 1) != exactCount[letter] ) {
                return false;
            }
        }
        for( const letter in minCount ) {
            if( (word.split(letter).length - 1) < minCount[letter]) {
                return false;
            }
        }

        return true;
    });
}

function evaluateMultipleGuesses(guesses, feedbacks, wordlist) {
    for( let i = 0; i < guesses.length; i++ ) {
        console.log(`${wordlist.length} words before guess ${i}`);
        wordlist = evaluateSingleGuess(guesses[i], feedbacks[i], wordlist);
        if( wordlist.length < 10 ) {
            console.log(`Words after guess ${i}: ${wordlist}`);
        }
    }
    
    return wordlist;
}

function wordleReal(guesses, feedbacks) {
    return evaluateMultipleGuesses(guesses, feedbacks, masterWordList.map( a => a.toUpperCase()));
}

module.exports = { evaluateSingleGuess, evaluateMultipleGuesses, wordleReal };

console.log(
    wordleReal(["CRATE", "WROTE", "BRUTE"], ["-G-GG", "-G-GG", "-G-GG"])
)

