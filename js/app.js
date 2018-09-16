/*
 * Global variables
 */
let card = document.getElementsByClassName('card');
let cards = [...card];
let flippedCards = [];
let matchedCards = 0;
let matchCards = document.getElementsByClassName('match');
const deck = document.querySelector('.deck');

let moves = 0;
let movesCounter = document.querySelector('.moves');

let starsList = document.querySelector('.stars li');
const star = document.querySelectorAll('.fa-star');

let modal = document.querySelector('.modal');
let background = document.querySelector('.bg_modal');

let timer = document.querySelector('.timer');
let second, minute, hour, interval;

let closeicon = document.querySelector(".close");
/*
 * Start game on onload
*/
document.body.onload = newGame();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function newGame(){
  //shuffle cards
  cards = shuffle(cards);
  //add each card's HTML to the deck
  for (let i = 0; i < cards.length; i++){
    deck.innerHTML = "";
    Array.prototype.forEach.call(cards, function(item) {
        deck.appendChild(item);
    });
    cards[i].classList.remove("open", "show", "match", "disabled");
  }
  //reset stars
  for (let i = 0; i < star.length; i++){
    star[i].style.color = "#FFD700";
    star[i].style.visibility = 'visible';
  }
  //reset moves
  moves=0;
  movesCounter.innerHTML = moves;
  //reset timer
  second = 0;
  minute = 0;
  hour = 0;
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//Adding event listeners to each card
deck.addEventListener("click", function(e){
  const clickObject = e.target;
  if (clickObject.classList.contains('card')&&flippedCards.length<2){
    flipCards(clickObject);
    addFlippedCards(clickObject);
    if (flippedCards.length===2){
      checkForMatchedCards(clickObject);
      finalMove();
      gameOver();
    }
    }
});

//Toggle cards' class lists
function flipCards(clickObject){
  clickObject.classList.toggle('open');
  clickObject.classList.toggle('show');
  /*
   *code reference: https://github.com/sandraisrael/Memory-Game-fend
   *Originally, I was working without the 'disabled' class list.
   */
  clickObject.classList.toggle('disabled');
}

//Adding flipped cards to an array
function addFlippedCards(clickObject){
  flippedCards.push(clickObject);
  console.log(flippedCards);
}

//Checking for matched cards
function checkForMatchedCards(){
  /*
   *code reference: https://github.com/sandraisrael/Memory-Game-fend
   *Originally, I was working without the 'disabled' class list.
   *But I had to simplify my code.
   */
  if (flippedCards[0].type===flippedCards[1].type){
    flippedCards[0].classList.add("match","disabled");
    flippedCards[1].classList.add("match","disabled");
    flippedCards[0].classList.remove("show", "open");
    flippedCards[1].classList.remove("show", "open");
    matchedCards+=2;
    console.log(matchedCards);
    flippedCards = [];
  }else{
    console.log("not a match");
    setTimeout(function(){
      flipCards(flippedCards[0]);
      flipCards(flippedCards[1]);
      flippedCards = [];
    }, 1200);
  }
}

//reset game
function restartGame(){
  window.location.reload();
}

//Score panel
function finalMove(){
  //calculating the moves
  moves++;
  movesCounter.innerHTML = moves;
  //starting the timer
  if(moves == 1){
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }
  //star rating
  if (moves > 8 && moves < 12){
        for( let i= 0; i < 3; i++){
            if(i > 1){
                star[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 13){
        for( let i= 0; i < 3; i++){
            if(i > 0){
                star[i].style.visibility = "collapse";
            }
        }
    }
}

//Pop up modal and final scoring
function gameOver(){
  if (matchedCards === 16){

      //stopping timer
      clearInterval(interval);

      //show pop-up modal
      background.style.display = 'block';
      modal.style.display = 'block';
      console.log("modal should show");

      //create the scoring HTML and show it on the modal
      let starRating = document.querySelector(".stars").innerHTML;
      let finalTime = timer.innerHTML
      document.getElementById("finalMove").innerHTML = moves;
      document.getElementById("starRating").innerHTML = starRating;
      document.getElementById("totalTime").innerHTML = finalTime;

      //close modal
      closeModal();
  };
}

//Closing the modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
      //e.preventDefault();
      background.style.display = 'none';
      modal.style.display = 'none';
      matchedCards=0;
      newGame();
    });
}

function startTimer(){
  /*
   *code reference: https://github.com/sandraisrael/Memory-Game-fend
   *My original timer function did not function properly
   */
  interval = setInterval(function(){
    timer.innerHTML=minute+"mins "+second+"secs";
    second++;
    if (second==60){
      minute++;
      second=0;
    }
    if(minute==60){
      hour++;
      minute=0;
    }
  },1000);
}
