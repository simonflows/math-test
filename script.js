(function () {
  'use strict';

  const questions = [
    {
      text: 'Какое из следующих уравнений является линейным?',
      options: ['x² - 4 = 0', '3x - 12 = 0', '√x = 5', '2^x = 8'],
      correct: 1
    },
    {
      text: 'Найдите корень уравнения: 4x - 8 = 12.',
      options: ['1', '4', '5', '-5'],
      correct: 2
    },
    {
      text: 'Сколько различных действительных корней имеет квадратное уравнение, если дискриминант D > 0?',
      options: ['Два', 'Один', 'Ни одного', 'Бесконечно много'],
      correct: 0
    },
    {
      text: 'Сколько действительных корней имеет квадратное уравнение, если дискриминант D < 0?',
      options: ['Два', 'Один', 'Бесконечно много', 'Ни одного'],
      correct: 3
    },
    {
      text: 'Найдите корни уравнения: x² - 9 = 0.',
      options: ['Только 3', '±3', 'Только 9', '±9'],
      correct: 1
    },
    {
      text: 'Найдите корень уравнения: √x = 7.',
      options: ['14', '√7', '49', '3,5'],
      correct: 2
    },
    {
      text: 'Решите показательное уравнение: 2^x = 16.',
      options: ['4', '8', '3', '2'],
      correct: 0
    },
    {
      text: 'Решите уравнение: 3^(x + 1) = 27.',
      options: ['3', '1', '9', '2'],
      correct: 3
    },
    {
      text: 'Найдите значение x, если log₂ x = 3.',
      options: ['6', '8', '9', '5'],
      correct: 1
    },
    {
      text: 'Решите уравнение: log₅ x = 2.',
      options: ['10', '7', '25', '32'],
      correct: 2
    },
    {
      text: 'Чему равно произведение степеней с одинаковым основанием a^n · a^m?',
      options: ['a^(n + m)', 'a^(n · m)', 'a^(n - m)', '(2a)^(n + m)'],
      correct: 0
    },
    {
      text: 'Вычислите значение выражения: 2⁷ / 2⁴.',
      options: ['6', '16', '2', '8'],
      correct: 3
    },
    {
      text: 'Какая формула выражает разность квадратов a² - b²?',
      options: ['(a - b)²', '(a - b)(a + b)', 'a² - 2ab + b²', '(a + b)²'],
      correct: 1
    },
    {
      text: 'Раскройте формулу квадрата суммы: (a + b)².',
      options: ['a² + b²', 'a² - 2ab + b²', 'a² + 2ab + b²', '2a + 2b'],
      correct: 2
    },
    {
      text: 'Графиком какой функции является парабола?',
      options: ['y = ax² + bx + c', 'y = kx + b', 'y = k / x', 'y = a^x'],
      correct: 0
    },
    {
      text: 'Графиком какой функции является гипербола?',
      options: ['y = kx + b', 'y = x²', 'y = √x', 'y = k / x'],
      correct: 3
    },
    {
      text: 'Как ведет себя график прямой y = kx + b, если угловой коэффициент k > 0?',
      options: ['Функция убывает', 'Функция возрастает', 'График параллелен оси Ox', 'График параллелен оси Oy'],
      correct: 1
    },
    {
      text: 'Куда направлены ветви параболы y = ax² + bx + c, если коэффициент a > 0?',
      options: ['Вниз', 'Вправо', 'Вверх', 'Влево'],
      correct: 2
    },
    {
      text: 'В чем заключается физический смысл производной пути по времени s\'(t)?',
      options: ['Мгновенная скорость', 'Пройденный путь', 'Масса тела', 'Ускорение свободного падения'],
      correct: 0
    },
    {
      text: 'В чем заключается геометрический смысл производной функции в точке f\'(x₀)?',
      options: ['Длина графика функции', 'Площадь под графиком', 'Координата начала графика', 'Угловой коэффициент касательной'],
      correct: 3
    }
  ];

  const letters = ['A', 'B', 'C', 'D'];
  let currentIndex = 0;
  let score = 0;
  let sessionSalt = createSalt();
  let isTransitioning = false;

  const quizCard = document.getElementById('quiz-card');
  const resultCard = document.getElementById('result-card');
  const currentNumEl = document.getElementById('current-num');
  const totalNumEl = document.getElementById('total-num');
  const percentLabelEl = document.getElementById('percent-label');
  const progressFillEl = document.getElementById('progress-fill');
  const questionWrapperEl = document.getElementById('question-wrapper');
  const questionTextEl = document.getElementById('question-text');
  const optionsListEl = document.getElementById('options-list');
  const scoreValEl = document.getElementById('score-val');
  const scorePercentEl = document.getElementById('score-percent');
  const btnRestart = document.getElementById('btn-restart');
  const verifCodeEl = document.getElementById('verif-code');

  function createSalt() {
    try {
      const arr = new Uint8Array(8);
      crypto.getRandomValues(arr);
      return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    }
  }

  async function sha256Hex(str) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      const enc = new TextEncoder().encode(str);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      const arr = Array.from(new Uint8Array(buf));
      return arr.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    // Простой детерминированный хеш на случай окружения без Web Crypto
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  }

  function formatTime(d) {
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function renderQuestion(index) {
    const q = questions[index];
    currentNumEl.textContent = String(index + 1);
    totalNumEl.textContent = String(questions.length);

    const percent = Math.round((index / questions.length) * 100);
    percentLabelEl.textContent = `${percent}%`;
    progressFillEl.style.width = `${Math.max(5, percent)}%`;

    questionWrapperEl.style.animation = 'none';
    // Trigger reflow
    void questionWrapperEl.offsetHeight;
    questionWrapperEl.style.animation = 'fadeIn 0.22s ease-out';

    questionTextEl.textContent = q.text;
    optionsListEl.innerHTML = '';

    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-letter">${letters[optIdx]}</span><span class="option-label">${optText}</span>`;
      btn.addEventListener('click', () => handleSelect(optIdx, btn));
      optionsListEl.appendChild(btn);
    });

    isTransitioning = false;
  }

  function handleSelect(selectedIndex, selectedBtn) {
    if (isTransitioning) return;
    isTransitioning = true;

    selectedBtn.classList.add('selected');
    const q = questions[currentIndex];
    if (selectedIndex === q.correct) {
      score += 1;
    }

    setTimeout(() => {
      currentIndex += 1;
      if (currentIndex < questions.length) {
        renderQuestion(currentIndex);
      } else {
        showResults();
      }
    }, 220);
  }

  async function showResults() {
    progressFillEl.style.width = '100%';
    percentLabelEl.textContent = '100%';

    quizCard.style.display = 'none';
    resultCard.style.display = 'block';

    const percent = Math.round((score / questions.length) * 100);
    scoreValEl.textContent = String(score);
    scorePercentEl.textContent = `${percent}% правильно`;

    const now = new Date();
    const timeStr = formatTime(now);
    const rawPayload = `${timeStr}|${score}|${questions.length}|${sessionSalt}|simonflows`;
    const fullHash = await sha256Hex(rawPayload);
    const shortCode = `${fullHash.slice(0, 4)}-${fullHash.slice(4, 8)}-${fullHash.slice(8, 12)}`;

    verifCodeEl.textContent = `ID: ${shortCode} • ${timeStr} • ${score}/20 (${percent}%) • VERIFIED`;
  }

  function restartQuiz() {
    currentIndex = 0;
    score = 0;
    sessionSalt = createSalt();
    isTransitioning = false;

    resultCard.style.display = 'none';
    quizCard.style.display = 'block';

    renderQuestion(0);
  }

  btnRestart.addEventListener('click', restartQuiz);

  // Старт тестирования
  renderQuestion(0);
})();
