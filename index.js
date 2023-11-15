document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const timerElement = document.getElementById("timer");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 20,
        height: 20,
        color: "red",
        speed: 5
    };

    const asteroids = [];
    const asteroidSpeed = 2;
    const asteroidInterval = 2000;
    const maxAsteroids = 30;

    let startTime;
    let bestTime = localStorage.getItem("bestTime") || Infinity;

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawAsteroids() {
        for (const asteroid of asteroids) {
            ctx.fillStyle = asteroid.color;
            ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
        }
    }

    function checkCollision() {
        for (const asteroid of asteroids) {
            if (
                player.x < asteroid.x + asteroid.width &&
                player.x + player.width > asteroid.x &&
                player.y < asteroid.y + asteroid.height &&
                player.y + player.height > asteroid.y
            ) {
                endGame();
            }
        }
    }

    function movePlayer(keyCode) {
        switch (keyCode) {
            case 37:
                player.x -= player.speed;
                break;
            case 38:
                player.y -= player.speed;
                break;
            case 39:
                player.x += player.speed;
                break;
            case 40:
                player.y += player.speed;
                break;
        }

        player.x = (player.x + canvas.width) % canvas.width;
        player.y = (player.y + canvas.height) % canvas.height;
    }

    function endGame() {
        const currentTime = new Date().getTime() - startTime;
        if (currentTime < bestTime) {
            bestTime = currentTime;
            localStorage.setItem("bestTime", bestTime);
        }

        alert(`Game Over!\nBest Time: ${formatTime(bestTime)}`);
        resetGame();
    }

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const millis = milliseconds % 1000;

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
    }

    function resetGame() {
        startTime = null;
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        asteroids.length = 0;
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawAsteroids();
        checkCollision();

        if (!startTime) {
            startTime = new Date().getTime();
        }

        if (asteroids.length < maxAsteroids && Math.random() < 1 / (asteroidInterval / 1000)) {
            const asteroid = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 30,
                height: 30,
                color: "gray",
                speedX: (Math.random() - 0.5) * asteroidSpeed,
                speedY: (Math.random() - 0.5) * asteroidSpeed
            };
            asteroids.push(asteroid);
        }

        for (const asteroid of asteroids) {
            asteroid.x += asteroid.speedX;
            asteroid.y += asteroid.speedY;

            asteroid.x = (asteroid.x + canvas.width) % canvas.width;
            asteroid.y = (asteroid.y + canvas.height) % canvas.height;
        }

        const currentTime = new Date().getTime() - startTime;
        timerElement.textContent = `Time: ${formatTime(currentTime)}`;

        requestAnimationFrame(gameLoop);
    }

    window.addEventListener("keydown", (e) => movePlayer(e.keyCode));

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    gameLoop();
});
