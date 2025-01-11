// script.js

const gameArea = document.getElementById("game-area");
const targetNumberDisplay = document.getElementById("target-number");
const scoreDisplay = document.getElementById("score");
const timeBar = document.getElementById("time-bar");
const gameOverMessage = document.getElementById("game-over-message");
const finalScore = document.getElementById("final-score");

let score = 0;
let timeLeft = 15; // Tiempo inicial en segundos
let targetNumber = 0; // Número objetivo
let gameInterval;

// Generar un número aleatorio entre min y max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Crear las 4 pelotas con números aleatorios
function createBalls() {
  gameArea.innerHTML = ""; // Limpiar el área de juego

  // Generar números únicos para las pelotas
  const ballNumbers = [];
  while (ballNumbers.length < 10) {
    const num = getRandomNumber(0, 99); // Números entre 1 y 20
    if (!ballNumbers.includes(num)) {
      ballNumbers.push(num);
    }
  }

  // Seleccionar un número objetivo de las pelotas
  targetNumber = ballNumbers[getRandomNumber(0, 3)];
  targetNumberDisplay.textContent = targetNumber;

  // Crear las pelotas en el área de juego
  ballNumbers.forEach((number) => {
    const ball = document.createElement("div");
    ball.className = "ball";
    ball.textContent = number;

    // Posicionar la pelota de forma aleatoria
    ball.style.left = `${getRandomNumber(0, gameArea.offsetWidth - 50)}px`;
    ball.style.top = `${getRandomNumber(0, gameArea.offsetHeight - 50)}px`;

    // Agregar evento al hacer clic en la pelota
    ball.addEventListener("click", () => {
      if (number === targetNumber) {
        score++;
        scoreDisplay.textContent = score;
        timeLeft = Math.min(timeLeft + 2.5, 30); // Aumentar tiempo en 5 segundos
        createBalls(); // Crear nuevas pelotas
      } else {
        // Restar 10 segundos por un clic incorrecto
        timeLeft -= 10;
        if (timeLeft <= 0) {
          endGame();
        }
      }
    });

    gameArea.appendChild(ball);
  });
}

// Reducir el tiempo y actualizar la barra
function updateTimeBar() {
  timeLeft -= 0.1; // Reducir tiempo gradualmente
  timeBar.style.width = `${(timeLeft / 30) * 100}%`;

  // Verificar si se terminó el tiempo
  if (timeLeft <= 0) {
    clearInterval(gameInterval);
    endGame();
  }
}

// Finalizar el juego
function endGame() {
  gameArea.innerHTML = ""; // Limpiar el área de juego
  gameOverMessage.style.display = "block";
  finalScore.textContent = score;
}

// Iniciar el juego
function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  gameOverMessage.style.display = "none";
  createBalls();
  gameInterval = setInterval(updateTimeBar, 100); // Actualizar barra cada 100 ms
}

startGame();

const restartButton = document.getElementById("restart-button");
const shareButton = document.getElementById("share-button");
const gameControls = document.getElementById("game-controls");

// Función para reiniciar el juego
restartButton.addEventListener("click", startGame);

// Función para compartir el juego con mensaje
shareButton.addEventListener("click", () => {
  const finalMessage = ` ¡Jugué "Atrapa el número"! Mi puntaje final fue ${score}. ¡Desafíame!`;
  const shareUrl = `https://rod-rod-rod.github.io/atrapanumero/ ${encodeURIComponent(finalMessage)}`; // Sustituir "example.com" por la URL del juego real
  
  // Si el navegador soporta la API de compartir
  if (navigator.share) {
    navigator.share({
      title: 'Atrapa el número',
      text: finalMessage,
      url: shareUrl
    }).catch((error) => console.log('Error al compartir', error));
  } else {
    // Si el navegador no soporta la API de compartir, se genera un enlace para copiar
    prompt("Comparte este mensaje con tus amigos:", finalMessage + " " + shareUrl);
  }
});

// Modificar la función endGame para mostrar los botones de reiniciar y compartir
function endGame() {
  gameArea.innerHTML = ""; // Limpiar el área de juego
  gameOverMessage.style.display = "block";
  finalScore.textContent = score;
  gameControls.style.display = "block"; // Mostrar los botones al terminar el juego
}
