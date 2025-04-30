const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let userSequence = [];
let level = 0;
let record = localStorage.getItem("simonRecord") || 0;
let acceptingInput = false;
let timer;
let timeRemaining = 5;  // Comienza con 5 segundos

const levelText = document.getElementById("level");
const recordText = document.getElementById("record");
const startButton = document.getElementById("start");
const timerText = document.getElementById("timer");  // Elemento para mostrar el tiempo restante

recordText.textContent = `Récord: ${record}`;
timerText.textContent = `Tiempo: ${timeRemaining}`;

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
  
  // Cambiar fondo con animación de transición
  changeBackground(level);

  // Iniciar el temporizador para el nivel actual
  startTimer();
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
    clearInterval(timer);  // Detener el temporizador
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

// ** Temporizador **
function startTimer() {
  clearInterval(timer);  // Reseteamos el temporizador

  // Calculamos el tiempo restante según el nivel
  if (level < 10) {
    timeRemaining = 5 + level - 1;  // 5 segundos iniciales + 1 segundo extra por nivel
  } else {
    timeRemaining = 14 + (level - 10) * 2;  // A partir de nivel 10, 2 segundos más por nivel
  }

  updateTimerDisplay();

  timer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      clearInterval(timer);  // Detener el temporizador
      document.getElementById("sound-error").play();  // Reproducir sonido de error
      levelText.textContent = "¡Perdiste! El tiempo se agotó.";
      acceptingInput = false;
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerText.textContent = `Tiempo: ${timeRemaining}`;
}

// ** Fondo dinámico con animación **
function changeBackground(level) {
  const body = document.body;
  body.style.transition = "background-color 1s";  // Añadimos transición para suavizar el cambio

  if (level <= 5) {
    body.style.backgroundColor = "#2f4f4f";  // Fondo más oscuro para los primeros niveles
  } else if (level <= 10) {
    body.style.backgroundColor = "#4682b4";  // Fondo azul
  } else if (level <= 15) {
    body.style.backgroundColor = "#32cd32";  // Fondo verde
  } else {
    body.style.backgroundColor = "#ff6347";  // Fondo rojo
  }
}
