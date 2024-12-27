let currentMultiplier = 1.00;
let gameActive = false;
let betAmount = 0;
let balance = parseFloat(localStorage.getItem('balance')) || 100; // Загружаем баланс из localStorage или устанавливаем начальный 100

const betInput = document.getElementById('bet');
const startButton = document.getElementById('startButton');
const cashoutButton = document.getElementById('cashoutButton');
const multiplierDisplay = document.getElementById('multiplierDisplay');
const balanceDisplay = document.getElementById('balanceDisplay');
const body = document.body; // Ссылка на body для изменения фона

// Функция для обновления баланса
function updateBalance() {
    balanceDisplay.textContent = `Баланс: ${balance}$`;
    localStorage.setItem('balance', balance); // Сохраняем новый баланс в localStorage
}

function startGame() {
    if (gameActive) return; // Если игра уже активна, не начинаем новую

    betAmount = parseFloat(betInput.value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        return; // Никаких уведомлений
    }

    balance -= betAmount; // Уменьшаем баланс на ставку
    updateBalance(); // Обновляем баланс на экране и сохраняем

    gameActive = true;
    currentMultiplier = 1.00;
    cashoutButton.disabled = false;

    let randomChance = Math.random();
    let targetMultiplier;

    // 70% шанс на коэффициент от 1.1x до 1.3x
    if (randomChance < 0.70) {
        targetMultiplier = 1.5 + Math.random() * 0.3; // Генерация коэффициента от 1.1 до 1.3
    }
    // 15% шанс на коэффициент от 1.4x до 2x
    else if (randomChance < 0.85) {
        targetMultiplier = 1.8 + Math.random() * 0.6; // Генерация коэффициента от 1.4 до 2
    }
    // 10% шанс на коэффициент от 2x до 3x
    else if (randomChance < 0.95) {
        targetMultiplier = 2.4 + Math.random() * 2; // Генерация коэффициента от 2 до 3
    }
    // 5% шанс на коэффициент 100x
    else {
        targetMultiplier = 10;
    }

    let gameInterval = setInterval(() => {
        if (gameActive) {
            // Плавное увеличение множителя
            if (currentMultiplier < targetMultiplier) {
                currentMultiplier += 0.005; // Медленный рост коэффициента (меньший шаг)
            } else {
                endGame(true); // Игра окончена с победой
            }
            multiplierDisplay.textContent = currentMultiplier.toFixed(2) + 'x'; // Обновляем множитель на экране
        }
    }, 100); // Интервал обновления остаётся 100 мс

    // Останавливаем игру через 30 секунд, если игрок не вывел
    setTimeout(() => {
        if (gameActive) {
            endGame(false); // Игра окончена с поражением
        }
    }, 30000);

    startButton.disabled = true;
}

function cashOut() {
    if (!gameActive) return;

    // Выигрыш
    const winAmount = betAmount * currentMultiplier;
    balance += winAmount; // Увеличиваем баланс на выигрыш
    updateBalance(); // Обновляем баланс на экране и сохраняем

    endGame(true); // Игра окончена с победой
}

function endGame(won) {
    gameActive = false;
    startButton.disabled = false;
    cashoutButton.disabled = true;

    if (won) {
        // Игра выиграна, оставляем стандартное оформление
        body.style.backgroundColor = '#111'; // Основной фон
        resetButtonStyles(); // Восстановление нормальных кнопок
    } else {
        // Игра проиграна, делаем фон красным
        body.style.backgroundColor = '#ff0000'; // Красный фон для поражения
        // Меняем цвет кнопок на красный
        startButton.style.backgroundColor = '#ff0000';
        cashoutButton.style.backgroundColor = '#ff0000';

        // Через 1 секунду восстанавливаем стиль
        setTimeout(() => {
            // Восстанавливаем фон через 1 секунду
            body.style.backgroundColor = '#111'; 
            resetButtonStyles(); // Восстанавливаем нормальные кнопки
        }, 1000);
    }
}

function resetButtonStyles() {
    startButton.style.backgroundColor = '#444'; // Восстановление начального цвета кнопки Старт
    cashoutButton.style.backgroundColor = '#444'; // Восстановление начального цвета кнопки Вывести
}

// Обновляем баланс при загрузке страницы
updateBalance();

startButton.addEventListener('click', startGame);
cashoutButton.addEventListener('click', cashOut);

