import gsap from "gsap";
const btnContainer = document.querySelector("#rps-container");
const botCard = document.querySelector("#bot");
const playerCard = document.querySelector("#player");
const endText = document.querySelector("#end-text");
const newGameBtn = document.querySelector("#new-game");
const scoreText = document.querySelector("#score");
const buttons = Array.from(btnContainer.children);
let outcome = "";
let score = 0;
let reverse = false;
let btnDisable = false;

const moves = {
  bot: "",
  player: "",
};

buttons.forEach((button, i) =>
  button.addEventListener("click", () => playRPS(i))
);

function playRPS(playerMove) {
  if (btnDisable) return;
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
      backgroundColor: "bisque",
    },
    "< +0.1"
  );
}

function showResult() {
  endText.textContent = reverse
    ? ""
    : outcome[0].toUpperCase() + outcome.slice(1);
  newGameBtn.classList.toggle("invisible");
  const distanceBetween =
    playerCard.getBoundingClientRect().y -
    botCard.getBoundingClientRect().y -
    playerCard.getBoundingClientRect().height -
    2;

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
  scoreText.textContent = score;
  reverse = !reverse;
  btnDisable = !btnDisable;
}

newGameBtn.addEventListener("click", () => {
  showResult();
  outcome = "";
  gsap.to(".card", { rotateY: 0 });
  gsap.set(".card", {
    backgroundColor: "gray",
    onComplete: () => {
      playerCard.textContent = "";
      botCard.textContent = "";
    },
    delay: 0.1,
  });
});

function changeText() {
  // console.log(moves[this.targets()[0].id]);
  this.targets()[0].textContent = moves[this.targets()[0].id];
}
