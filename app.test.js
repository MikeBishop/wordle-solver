const { doAllTheThings, evaluateSingleGuess, evaluateMultipleGuesses, wordleReal } = require('./app');

// This is a Jest unit test - see https://jestjs.io/docs/en/getting-started for more information
test('Green mismatch removed', () => {
    expect(
        evaluateSingleGuess("A", "G", ["A", "B", "C"])
    ).toEqual(["A"])
}); 

test('Gray match removed', () => {
    expect(
        evaluateSingleGuess("A", "-", ["A", "B", "C"])
    ).toEqual(["B", "C"])
}); 

test('Green plus gray removed', () => {
    expect(
        evaluateSingleGuess("AA", "G-", ["AA", "AB", "AC"])
    ).toEqual(["AB", "AC"])
}); 

test('Elimination of positions', () => {
    expect(
        evaluateSingleGuess("AAC", "GY-", ["AAA", "ABA", "ACA"])
    ).toEqual(["ABA"])
});

test('Green plus gray removed', () => {
    expect(
        evaluateMultipleGuesses(["APL", "AAA"], ["G--", "G-G"], ["AAA", "ABB", "AKA", "ALA", "AEA"])
    ).toEqual(["AKA", "AEA"])
});

