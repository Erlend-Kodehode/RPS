import gsap from "gsap";
const rockbtn = document.querySelector("#rock");
const paperbtn = document.querySelector("#paper");
const scissorbtn = document.querySelector("#scissors");
const btnContainer = document.querySelector("#btn-container");

const buttons = Array.from(btnContainer.children);

buttons.forEach((button, i) => {
  button.addEventListener("click", () => {
    playRPS(i);
  });
});

function playRPS(playerMove) {
  const randomMove = Math.floor(Math.random() * 3);
  if (playerMove === randomMove) {
    console.log("draw");
  } else {
    switch (randomMove) {
      case 0:
        console.log("rock");
        if (playerMove === 1) {
          console.log("win");
        } else {
          console.log("lose");
        }
        break;

      case 1:
        console.log("paper");
        if (playerMove === 2) {
          console.log("win");
        } else {
          console.log("lose");
        }
        break;

      case 2:
        console.log("scissors");
        if (playerMove === 0) {
          console.log("win");
        } else {
          console.log("lose");
        }
        break;
    }
  }
}
