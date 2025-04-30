const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let userSequence = [];
let level = 0;
let record = localStorage.getItem("simonRecord") || 0;
let acceptingInput = false;

const levelText = document.getElementById("level");
const recordText = document.getElementById("record");
const startButton = document.getElementById("start");

recordText.textContent = `Récord: ${record}`;

colors.forEach(color => {
  document.getElementById(color).addEventListener("click", () => handleClick(color));
});

startButton.addEventListener("click", startGame);

function startGame() {
  sequence = [];
  userSequence = [];
  level = 0;
  nextLevel();
}

function nextLevel() {
  userSequence = [];
  acceptingInput = false;
  level++;
  levelText.textContent = `Nivel ${level}`;
  updateRecord();
  const nextColor = colors[Math.floor(Math.random() * 4)];
  sequence.push(nextColor);
  playSequence();
}

function playSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = sequence[i];
    flash(color);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      acceptingInput = true;
    }
  }, 600);
}

function flash(color) {
  const btn = document.getElementById(color);
  const sound = document.getElementById(`sound-${color}`);
  btn.classList.add("active");
  sound.currentTime = 0;
  sound.play();
  setTimeout(() => btn.classList.remove("active"), 300);
}

function handleClick(color) {
  if (!acceptingInput) return;

  stopAllSounds();

  userSequence.push(color);
  

  const currentIndex = userSequence.length - 1;
  if (userSequence[currentIndex] !== sequence[currentIndex]) {
    document.getElementById("sound-error").play();
    levelText.textContent = "¡Perdiste! Presiona 'Comenzar'";
    flashError();
    acceptingInput = false;
    return;
  }

  flash(color);
  document.getElementById(`sound-${color}`).play();

  if (userSequence.length === sequence.length) {
    setTimeout(nextLevel, 800);
  }
}

function stopAllSounds() {
    // Detener todos los sonidos en reproducción
    const sounds = document.querySelectorAll("audio");
    sounds.forEach(sound => sound.pause());
    sounds.forEach(sound => sound.currentTime = 0); // Reiniciar el tiempo
  }

function updateRecord() {
  if (level > record) {
    record = level;
    localStorage.setItem("simonRecord", record);
    recordText.textContent = `Récord: ${record}`;
  }
}

function flashError() {
    document.body.classList.add("flash-error-active");
  
    setTimeout(() => {
      document.body.classList.remove("flash-error-active");
    }, 400);
  }
  