import { gsap } from "gsap.js";
const btnContainer = document.querySelector("#rps-container");
const opponentCard = document.querySelector("#opponent");
const playerCard = document.querySelector("#player");
const endText = document.querySelector("#end-text");
const newGameBtn = document.querySelector("#new-game");
const resetbtn = document.querySelector("#reset");
const scoreText = document.querySelector("#score");
const highScoreText = document.querySelector("#high-score");
const buttons = Array.from(btnContainer.children);
let outcome = "";
let reverse = false;
let btnDisable = false;

//stores the moves as an object so it can be easier accessed later using the id of a card as a key
const moves = {
  opponent: "",
  player: "",
};

//stores score
const storedScore = localStorage.getItem("score");
let score = storedScore ? storedScore : 0;
scoreText.textContent = score;

const storedHighScore = localStorage.getItem("high-score");
let highScore = storedHighScore ? storedHighScore : 0;
highScoreText.textContent = highScore;

//loops over the buttons to avoid having to write the same eventlistener three times
buttons.forEach((button, i) =>
  button.addEventListener("click", () => playRPS(i))
);

function playRPS(playerMove) {
  //disables the RPS buttons so they can't be clicked before a new game is started
  if (btnDisable) return;
  btnDisable = true;

  const randomMove = Math.floor(Math.random() * 3);

  //gets the icon for the player card
  moves.player = buttons[playerMove].textContent;

  //determines the outcome and gives the opponent card the right icon
  if (playerMove === randomMove) outcome = "draw";
  switch (randomMove) {
    case 0:
      moves.opponent = "🪨";
      if (outcome !== "draw") outcome = playerMove === 1 ? "win" : "lose";
      break;

    case 1:
      moves.opponent = "📄";
      if (outcome !== "draw") outcome = playerMove === 2 ? "win" : "lose";
      break;

    case 2:
      moves.opponent = "✂️";
      if (outcome !== "draw") outcome = playerMove === 0 ? "win" : "lose";
      break;
  }

  //animates the cards
  const cardFlipAnim = gsap.timeline({
    defaults: {
      stagger: {
        amount: 1,
        from: "end",
      },
    },
    //runs the showResult function at the end of the whole animation
    onComplete: showResult,
  });
  cardFlipAnim.to(".card", { rotateY: 180 }).set(
    ".card",
    {
      //runs the changeText function at the end of the individual cards animation
      stagger: { onComplete: changeText, amount: 1, from: "end" },
      backgroundColor: "rgb(215, 245, 215)",
      borderColor: "lightgray",
    },
    "< +0.1"
  );
}

//gets the right icon from the moves object using the cards id as a key
function changeText() {
  this.targets()[0].textContent = moves[this.targets()[0].id];
}

function showResult() {
  //shows or hides the outcome depending on if the animation is reversed or not
  endText.textContent = reverse
    ? ""
    : outcome[0].toUpperCase() + outcome.slice(1);

  //shows or hides the buttons depending on if the animation is reversed or not
  newGameBtn.classList.toggle("invisible");
  resetbtn.classList.toggle("invisible");

  //gets the distance between the cards
  const distanceBetween =
    playerCard.getBoundingClientRect().y -
    opponentCard.getBoundingClientRect().y -
    playerCard.getBoundingClientRect().height;

  //plays an animation depending on the outcome and adjust the score
  switch (outcome) {
    case "win":
      gsap.to(playerCard, { y: -distanceBetween, ease: "bounce.out" });
      if (!reverse) score++;
      break;

    case "draw":
      gsap.to(playerCard, { y: -distanceBetween / 2, ease: "bounce.out" });
      gsap.to(opponentCard, { y: distanceBetween / 2, ease: "bounce.out" });
      break;
    case "lose":
      gsap.to(opponentCard, { y: distanceBetween, ease: "bounce.out" });
      if (!reverse) score = 0;
      break;
  }

  //only runs when the animation isn't in reverse
  if (!reverse) {
    //saves the score
    if (score) localStorage.setItem("score", score);
    else localStorage.removeItem("score");
    scoreText.textContent = score;

    //updates and saves the highscore if the score is higher than the highscore
    if (highScore < score) {
      highScore = score;
      localStorage.setItem("high-score", highScore);
      highScoreText.textContent = highScore;
    }
  }
  //toggles to indicate if the animation is running in reverse or not
  reverse = !reverse;
}

//eventlistener to start a new game
newGameBtn.addEventListener("click", () => {
  //enables the RPS buttons
  btnDisable = false;
  //calling the function after the animation is finished reverses the animation
  showResult();
  outcome = "";
  //animation to flip the cards back
  gsap.to(".card", { rotateY: 0 });
  gsap.set(".card", {
    backgroundColor: "darkseagreen",
    borderColor: "gray",
    //removes the icons
    onComplete: () => {
      playerCard.textContent = "";
      opponentCard.textContent = "";
    },
    delay: 0.1,
  });
});

//resets the score
resetbtn.addEventListener("click", () => {
  localStorage.removeItem("score");
  localStorage.removeItem("high-score");
  score = 0;
  highScore = 0;
  highScoreText.textContent = highScore;
  scoreText.textContent = score;
});
