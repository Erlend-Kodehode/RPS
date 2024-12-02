import gsap from "gsap";
const btnContainer = document.querySelector("#rps-container");
const botCard = document.querySelector("#bot");
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

const storedScore = localStorage.getItem("score");
let score = storedScore ? storedScore : 0;
scoreText.textContent = score;

const storedHighScore = localStorage.getItem("high-score");
let highScore = storedHighScore ? storedHighScore : 0;
highScoreText.textContent = highScore;

const moves = {
  bot: "",
  player: "",
};

buttons.forEach((button, i) =>
  button.addEventListener("click", () => playRPS(i))
);

function playRPS(playerMove) {
  if (btnDisable) return;
  btnDisable = true;
  const randomMove = Math.floor(Math.random() * 3);
  moves.player = buttons[playerMove].textContent;
  if (playerMove === randomMove) outcome = "draw";
  switch (randomMove) {
    case 0:
      moves.bot = "🪨";
      if (outcome !== "draw") outcome = playerMove === 1 ? "win" : "lose";
      break;

    case 1:
      moves.bot = "📄";
      if (outcome !== "draw") outcome = playerMove === 2 ? "win" : "lose";
      break;

    case 2:
      moves.bot = "✂️";
      if (outcome !== "draw") outcome = playerMove === 0 ? "win" : "lose";
      break;
  }

  const cardFlipAnim = gsap.timeline({
    defaults: {
      stagger: {
        amount: 1,
        from: "end",
      },
    },
    onComplete: showResult,
  });
  cardFlipAnim.to(".card", { rotateY: 180 }).set(
    ".card",
    {
      stagger: { onComplete: changeText, amount: 1, from: "end" },
      backgroundColor: "rgb(215, 245, 215)",
      borderColor: "lightgray",
    },
    "< +0.1"
  );
}

function changeText() {
  this.targets()[0].textContent = moves[this.targets()[0].id];
}

function showResult() {
  endText.textContent = reverse
    ? ""
    : outcome[0].toUpperCase() + outcome.slice(1);
  newGameBtn.classList.toggle("invisible");
  resetbtn.classList.toggle("invisible");
  const distanceBetween =
    playerCard.getBoundingClientRect().y -
    botCard.getBoundingClientRect().y -
    playerCard.getBoundingClientRect().height;

  switch (outcome) {
    case "win":
      gsap.to(playerCard, { y: -distanceBetween, ease: "bounce.out" });
      if (!reverse) score++;
      break;

    case "draw":
      gsap.to(playerCard, { y: -distanceBetween / 2, ease: "bounce.out" });
      gsap.to(botCard, { y: distanceBetween / 2, ease: "bounce.out" });
      break;
    case "lose":
      gsap.to(botCard, { y: distanceBetween, ease: "bounce.out" });
      if (!reverse) score = 0;
      break;
  }
  if (!reverse) {
    if (score) localStorage.setItem("score", score);
    else localStorage.removeItem("score");
    scoreText.textContent = score;
    if (highScore < score) {
      highScore = score;
      localStorage.setItem("high-score", highScore);
      highScoreText.textContent = highScore;
    }
  }
  reverse = !reverse;
}

newGameBtn.addEventListener("click", () => {
  btnDisable = false;
  showResult();
  outcome = "";
  gsap.to(".card", { rotateY: 0 });
  gsap.set(".card", {
    backgroundColor: "darkseagreen",
    borderColor: "gray",
    onComplete: () => {
      playerCard.textContent = "";
      botCard.textContent = "";
    },
    delay: 0.1,
  });
});

resetbtn.addEventListener("click", () => {
  localStorage.removeItem("score");
  localStorage.removeItem("high-score");
  score = 0;
  highScore = 0;
  highScoreText.textContent = highScore;
  scoreText.textContent = score;
});
