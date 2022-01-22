/**
 * criteria:
 * - click button to start game
 * - user should try and guesss letters in word
 * - game is timed
 * - win if user guesses all correct letters in the word
 * - lose game if do not solve game in time 
 * 
 */


/**
 * specifications:
 * - when correctly guessing a letter -> corresponding blank box should appear
 * - message appears when user wins or loses
 *      - timer should also stop
 * - hitting start game should reset/restart timer
 * - wins and loses should persist after refreshing/closing browser
 * 
 * 
 */


/**
 * global variables => want to access from anywhere (since mainpulated);
 * - generated word is empty since it will be filled in by generatedRandomWord Function  
 * - want generated word length  for future iterations
 * - hardcoded list of possible words
 */
let generatedWord = "";
let lettersRemaining = generatedWord.length;
let randomCodeWords = ['brackets', 'syntax', 'function', 'loop', 'array', 'algorithms', 'attributes', 'events', 'bubbling', 'git', 'dom', 'iterate', 'append', 'child'];

// create user object to store user records
let userRecord = {
    wins: localStorage.getItem('wins') !== undefined ? localStorage.getItem('wins') : 0,
    losses: localStorage.getItem('losses'),
}



// helper to randomly generate a word;
const generateRandomWord = () => {
    let randomIndex = Math.floor(Math.random() * randomCodeWords.length);
    generatedWord = randomCodeWords[randomIndex];
    lettersRemaining = generatedWord.length;

    console.log(generatedWord);
    return generatedWord;
}

// helpere to dynamically generate blanks for random word
const clearAllGameContent = (word) => {
    let randomWordLength = word.length;
    let wordContainer = document.getElementById('word-container');

    let counter = 0;
    while (counter < randomWordLength) {
        let newBlank = document.createElement('span');
        newBlank.setAttribute('class', 'blank');
        newBlank.setAttribute('data-letter', word[counter]);
        newBlank.setAttribute('data-id', counter);
        newBlank.textContent = '_';
        wordContainer.appendChild(newBlank);
        counter++;
    }
}

// helper function to clear last game
const clearBlanks = () => {
    let blanksContainer = document.getElementById('word-container');
    while(blanksContainer.firstChild) {
        blanksContainer.removeChild(blanksContainer.firstChild)
    }

    let outcome = document.getElementById('outcome-message');
    outcome.innerHTML = "";

}

// helper => retrieve local storage 
const updateRecord = () => {
    let wins = localStorage.getItem('wins');
    let losses = localStorage.getItem('losses');

    let winsCounter = document.getElementById('wins-count');
    let lossCounter = document.getElementById('loss-count');

    winsCounter.textContent = wins;
    lossCounter.innerHTML = losses;
}





// start timer using interval
const startTimer = () => {
    // clear past game if any
    clearBlanks()

    // generate new random word
    let chosenWord = generateRandomWord();

    // dynamically create blanks for word
    clearAllGameContent(chosenWord);

    // create timer for guessing question
    let timeLeft = 45;
    let timer = document.getElementById('timer');

    // outcome message => dynamic depending on user solving word blanks
    let outcome = document.getElementById('outcome-message');

    // interval of actions to be executed eveery second
    let timerStarted = setInterval(() => {
        // update timer text
        timer.innerText = timeLeft

        // decrement countdown timer
        timeLeft--;

        // check to see if time has ended and how many letters are remaining;
        if (timeLeft  < 0 && lettersRemaining > 0) {
            outcome.innerHTML = 'You Lose!';
            userRecord.losses++;
            // save to local storage before clearing timer
            localStorage.setItem('losses', JSON.stringify(userRecord.losses));
            updateRecord();
            clearInterval(timerStarted)
        } 

        if (timeLeft > 0 && lettersRemaining === 0) {
            outcome.innerHTML = 'You Win!';
            userRecord.wins++;
            localStorage.setItem('wins', JSON.stringify(userRecord.wins));
            updateRecord();
            clearInterval(timerStarted);
        }
    }, 1000);
}



document.getElementById('start-game').addEventListener('click', startTimer)



// compares keydown user guess to hidden word letters
const compareToHiddenWord = (event) => {
    // users key pressed
    let keyPressed = event.key;

    // all letters in blank
    let allLetters = document.querySelectorAll('.blank');

    // iterate <span> elements in #word-container
    allLetters.forEach(value => {
        // checking value is a blank (_) => that way i am not repeating the same steps on a solved character
        if (value.innerHTML === '_') {

            // check to see if the blank's data-leter value is the same as the key pressed
            if (value.dataset.letter === keyPressed) {
                    lettersRemaining--;
                    value.innerHTML = keyPressed;


            }
        }

       
    })
}

// set record 
updateRecord();


// add keydown event to register user input
document.addEventListener('keydown', compareToHiddenWord);

// set wins and losses on page load
let wins = localStorage.getItem('wins');
let losses = localStorage.getItem('losses');

let winsCounter = document.getElementById('wins-count');
let lossCounter = document.getElementById('loss-count');

// resets user object wins and losses => then proceeds to update local storage with userRecord values
const resetRecord = () => {
    userRecord.wins = 0;
    userRecord.losses = 0;

    localStorage.setItem('wins', userRecord.wins);
    localStorage.setItem('losses',userRecord.losses );

    // update UI with new local storage values 
    let winsCounter = document.getElementById('wins-count');
    let lossCounter = document.getElementById('loss-count');

    winsCounter.innerHTML = localStorage.getItem('wins');
    lossCounter.innerHTML = localStorage.getItem('losses')
}

// creating click event for reset button
document.getElementById('reset-score').addEventListener('click', resetRecord);
