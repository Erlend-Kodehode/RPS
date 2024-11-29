import gsap from "gsap";
const btnContainer = document.querySelector("#rps-container");
const botCard = document.querySelector("#bot");
const playerCard = document.querySelector("#player");
const endText = document.querySelector("#end-text");
let botMove = "";
let outcome = "";
const buttons = Array.from(btnContainer.children);

buttons.forEach((button, i) =>
  button.addEventListener("click", () => playRPS(i))
);

function playRPS(playerMove) {
  const randomMove = Math.floor(Math.random() * 3);
  if (playerMove === randomMove) outcome = "draw";
  switch (randomMove) {
    case 0:
      botMove = "🪨";
      if (outcome !== "draw") outcome = playerMove === 1 ? "win" : "lose";
      break;

    case 1:
      botMove = "📄";
      if (outcome !== "draw") outcome = playerMove === 2 ? "win" : "lose";
      break;

    case 2:
      botMove = "✂️";
      if (outcome !== "draw") outcome = playerMove === 0 ? "win" : "lose";
      break;
  }

  const cardFlipAnim = gsap.timeline({
    defaults: {
      stagger: {
        amount: 1,
        from: "end",
        onComplete: () =>
          (playerCard.textContent = buttons[playerMove].textContent),
      },
    },
    onComplete: showResult,
  });
  cardFlipAnim.to(".card", { rotateY: 180 }).set(
    ".card",
    {
      backgroundColor: "bisque",
      onComplete: () => (botCard.textContent = botMove),
    },
    "< +0.1"
  );
}

function showResult() {
  endText.textContent = outcome;
  // gsap.to(playerCard, { yPercent: -100, ease: "bounce.out" });
  const distanceBetween =
    playerCard.getBoundingClientRect().y -
    botCard.getBoundingClientRect().y -
    102;

  switch (outcome) {
    case "win":
      gsap.to(playerCard, { y: -distanceBetween, ease: "bounce.out" });

      break;

    case "draw":
      gsap.to(playerCard, { y: -distanceBetween / 2, ease: "bounce.out" });
      gsap.to(botCard, { y: distanceBetween / 2, ease: "bounce.out" });
      break;
    case "lose":
      gsap.to(botCard, { y: distanceBetween, ease: "bounce.out" });
      break;
  }
}
