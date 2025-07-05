// script.js

const gameArea = document.getElementById("game-area");
const targetNumberDisplay = document.getElementById("target-number");
const scoreDisplay = document.getElementById("score");
const timeBar = document.getElementById("time-bar");
const gameOverMessage = document.getElementById("game-over-message");
const finalScore = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const shareButton = document.getElementById("share-button");
const gameControls = document.getElementById("game-controls");

let score = 0;
let timeLeft = 30;
let targetNumber = 0;
let gameInterval;

// Generar un número aleatorio entre min y max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Verificar si dos pelotas se superponen
function checkOverlap(x1, y1, x2, y2, size) {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return distance < size;
}

// Crear las pelotas con números aleatorios
function createBalls() {
  gameArea.innerHTML = "";

  // Generar números únicos para las pelotas
  const ballNumbers = [];
  while (ballNumbers.length < 10) {
    const num = getRandomNumber(0, 99);
    if (!ballNumbers.includes(num)) {
      ballNumbers.push(num);
    }
  }

  // Seleccionar un número objetivo de las pelotas
  targetNumber = ballNumbers[getRandomNumber(0, ballNumbers.length - 1)];
  targetNumberDisplay.textContent = targetNumber;

  // Posiciones ocupadas para evitar superposición
  const positions = [];
  const ballSize = 50;
  const maxWidth = gameArea.offsetWidth - ballSize;
  const maxHeight = gameArea.offsetHeight - ballSize;

  // Crear las pelotas en el área de juego
  ballNumbers.forEach((number) => {
    const ball = document.createElement("div");
    ball.className = "ball";
    ball.textContent = number;

    // Encontrar una posición que no se superponga
    let attempts = 0;
    let x, y;
    do {
      x = getRandomNumber(0, maxWidth);
      y = getRandomNumber(0, maxHeight);
      attempts++;
    } while (
      positions.some(pos => checkOverlap(x, y, pos.x, pos.y, ballSize + 10)) && 
      attempts < 50
    );

    positions.push({x, y});
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    // Agregar evento al hacer clic en la pelota
    ball.addEventListener("click", () => {
      if (number === targetNumber) {
        score++;
        scoreDisplay.textContent = score;
        timeLeft = Math.min(timeLeft + 2.5, 30);
        createBalls();
      } else {
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
  timeLeft -= 0.1;
  timeBar.style.width = `${(timeLeft / 30) * 100}%`;

  if (timeLeft <= 0) {
    clearInterval(gameInterval);
    endGame();
  }
}

// Finalizar el juego
function endGame() {
  gameArea.innerHTML = "";
  gameOverMessage.style.display = "block";
  finalScore.textContent = score;
  gameControls.style.display = "flex";
}

// Iniciar el juego
function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  gameOverMessage.style.display = "none";
  gameControls.style.display = "none";
  createBalls();
  gameInterval = setInterval(updateTimeBar, 100);
}

// Función para reiniciar el juego
restartButton.addEventListener("click", () => {
  clearInterval(gameInterval);
  startGame();
});

// Función para compartir el juego con mensaje personalizado
shareButton.addEventListener("click", () => {
  const gameUrl = "https://rod-rod-rod.github.io/atrapanumero/"; // Cambia por tu URL real
  
  // Mensajes personalizados con el puntaje y reto
  const messages = [
    `¡Conseguí ${score} puntos en "Atrapa el Número"! ¿Puedes superarme?`,
    `Mi récord en "Atrapa el Número": ${score} puntos. ¡Te reto a que lo superes!`,
    `${score} puntos en "Atrapa el Número"! ¿Crees que puedes hacerlo mejor?`,
    `¡Logré ${score} puntos! ¿Tienes la velocidad para superarme en "Atrapa el Número"?`,
    `Desafío completado: ${score} puntos en "Atrapa el Número". ¡Ahora es tu turno!`
  ];
  
  // Seleccionar un mensaje aleatorio
  const randomMessage = messages[getRandomNumber(0, messages.length - 1)];
  
  // Mensaje completo con el link
  const fullMessage = `${randomMessage}\n\n¡Juega aquí: ${gameUrl}`;
  
  // Si el navegador soporta la API de compartir nativa
  if (navigator.share) {
    navigator.share({
      title: 'Atrapa el Número - Desafío',
      text: randomMessage,
      url: gameUrl
    }).then(() => {
      console.log('Contenido compartido exitosamente');
    }).catch((error) => {
      console.log('Error al compartir:', error);
      fallbackShare(fullMessage);
    });
  } else {
    // Función de respaldo para navegadores que no soportan la API nativa
    fallbackShare(fullMessage);
  }
});

// Función de respaldo para compartir
function fallbackShare(message) {
  // Intentar copiar al portapapeles
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(message).then(() => {
      showShareFeedback('¡Mensaje copiado al portapapeles! Pégalo en tus redes sociales para retar a tus amigos.');
    }).catch(() => {
      manualCopy(message);
    });
  } else {
    manualCopy(message);
  }
}

// Función para copiar manualmente
function manualCopy(message) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = message;
  tempTextArea.style.position = 'fixed';
  tempTextArea.style.left = '-9999px';
  document.body.appendChild(tempTextArea);
  tempTextArea.focus();
  tempTextArea.select();
  
  try {
    document.execCommand('copy');
    showShareFeedback('¡Mensaje copiado! Pégalo en tus redes sociales para retar a tus amigos.');
  } catch (err) {
    // Si todo falla, mostrar el mensaje para copiar manualmente
    prompt('Copia este mensaje y compártelo para retar a tus amigos:', message);
  }
  
  document.body.removeChild(tempTextArea);
}

// Mostrar feedback de compartir
function showShareFeedback(message) {
  // Crear elemento de feedback
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease;
  `;
  
  feedback.textContent = message;
  document.body.appendChild(feedback);
  
  // Agregar animación CSS
  if (!document.querySelector('#feedback-animation')) {
    const style = document.createElement('style');
    style.id = 'feedback-animation';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remover después de 4 segundos
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => {
        if (feedback.parentNode) {
          document.body.removeChild(feedback);
        }
      }, 300);
    }
  }, 4000);
}

// Iniciar el juego al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  startGame();
});