function createButtons() {
  // <a href="https://www.flaticon.com/free-icons/ui" title="ui icons">Ui icons created by RomStu - Flaticon</a>
  const icons = ["back-arrow", "forward-arrow", "swap"];
  icons.forEach((p, i) => {
    const button = document.createElement("button");
    const info = document.getElementById("info");
    button.style.left = `calc(${(i * 4 * 5) / 4}vh)`;
    button.style.backgroundImage = `url(assets/icons/${p}.png)`;
    button.id = p.split("-")[0];

    button.onmouseenter = () => {
      button.style.cursor = "pointer";
      button.style.backgroundColor = "rgb(100, 100, 100)";
    };
    button.onmouseleave = () => {
      button.style.backgroundColor = "rgb(128, 128, 128)";
    };

    button.onclick = (e) => {
      switch (e.target.id) {
        case "back":
          gameLog.changeMove(-1, gameState);
          break;
        case "forward":
          gameLog.changeMove(1, gameState);
          break;
        case "swap":
          board.reversed = !board.reversed;
          break;
      }
    };
    info.append(button);
  });
}
createButtons();
