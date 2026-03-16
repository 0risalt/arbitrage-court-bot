// src/services/kartotekaApi.js
// Имитация API Картотеки арбитражных дел
// В будущем  заменить содержимое функций на реальные fetch-запросы

// Имитация задержки сети
const delay = (ms, { signal } = {}) =>
    new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new Error('Запрос отменён'));
        }

        const timeout = setTimeout(resolve, ms);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new Error('Запрос отменён'));
            });
        }
    });

// База данных с тестовыми делами
const mockCases = {
    'А19-12345/2024': {
        number: 'А19-12345/2024',
        status: 'Назначено к слушанию',
        statusCode: 'hearing',
        judge: 'Иванова М.А.',
        plaintiff: 'ООО "Сибирские ресурсы"',
        defendant: 'ИП Петров А.В.',
        nextHearing: '15.04.2024 11:30',
        lastEvent: 'Поступил отзыв на иск',
        courtActs: 2
    },
    'А19-67890/2023': {
        number: 'А19-67890/2023',
        status: 'Решение вынесено',
        statusCode: 'decided',
        judge: 'Петров С.В.',
        plaintiff: 'Администрация г. Иркутска',
        defendant: 'ООО "СтройИнвест"',
        nextHearing: null,
        lastEvent: 'Решение вступило в силу',
        courtActs: 5
    },
    'А19-11111/2024': {
        number: 'А19-11111/2024',
        status: 'В процессе рассмотрения',
        statusCode: 'pending',
        judge: 'Сидорова Е.Н.',
        plaintiff: 'ИП Иванов А.А.',
        defendant: 'ООО "Торговый дом"',
        nextHearing: '22.04.2024 14:00',
        lastEvent: 'Назначено заседание',
        courtActs: 1
    }
};

// Генерация случайного дела для любого введенного номера
const generateRandomCase = (caseNumber) => {
    const statuses = [
        { text: 'Назначено к слушанию', code: 'hearing' },
        { text: 'В процессе рассмотрения', code: 'pending' },
        { text: 'Решение вынесено', code: 'decided' },
        { text: 'Апелляция', code: 'appeal' },
        { text: 'Производство приостановлено', code: 'suspended' }
    ];

    const judges = ['Иванова М.А.', 'Петров С.В.', 'Сидорова Е.Н.', 'Козлов Д.И.', 'Смирнова О.П.'];
    const companies = [
        'ООО "Сибирь"', 'АО "Байкал"', 'ИП Смирнов', 'ПАО "Иркутскэнерго"',
        'ООО "Восток"', 'ИП Петрова', 'Администрация', 'МУП "Водоканал"'
    ];

    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + Math.floor(Math.random() * 30) + 5);

    return {
        number: caseNumber,
        status: randomStatus.text,
        statusCode: randomStatus.code,
        judge: judges[Math.floor(Math.random() * judges.length)],
        plaintiff: companies[Math.floor(Math.random() * companies.length)],
        defendant: companies[Math.floor(Math.random() * companies.length)],
        nextHearing: Math.random() > 0.3 ? nextDate.toLocaleDateString('ru-RU') + ' 11:30' : null,
        lastEvent: ['Поступил иск', 'Поступил отзыв', 'Состоялось заседание', 'Вынесено определение'][Math.floor(Math.random() * 4)],
        courtActs: Math.floor(Math.random() * 5) + 1
    };
};

// ЭКСПОРТИРУЕМЫЕ ФУНКЦИИ

/**
 * Проверка формата номера дела
 * @param {string} caseNumber - номер дела (например, А19-12345/2024)
 * @returns {boolean}
 */
export const validateCaseNumber = (caseNumber) => {
    const pattern = /^[АA]\d{2,3}-\d+\/\d{4}$/;
    return pattern.test(caseNumber);
};

/**
 * Получение информации о деле по номеру
 * @param {string} caseNumber - номер дела
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Object>}
 */
export const getCaseInfo = async (caseNumber, signal) => {
    // ИМИТАЦИЯ ЗАПРОСА К API
    // В будущем заменить этот блок на реальный fetch

    console.log(`🔍 Запрос к Картотеке: дело ${caseNumber}`);

    // Имитация задержки сети (300-1500 мс)
    const waitTime = 800 + Math.random() * 700;
    await delay(waitTime, { signal });

    // Проверка отмены запроса
    if (signal?.aborted) {
        throw new Error('Запрос отменён');
    }

    // Если дело есть в тестовой базе - возвращаем его
    if (mockCases[caseNumber]) {
        return { ...mockCases[caseNumber] };
    }

    // Иначе генерируем случайное дело (имитация реального API)
    return generateRandomCase(caseNumber);

    /* ========== РЕАЛЬНАЯ РЕАЛИЗАЦИЯ (на будущее) ==========
    try {
      const response = await fetch(`https://kad.arbitr.ru/api/case/${caseNumber}`, {
        signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Преобразование данных из API в формат нашего приложения
      return {
        number: data.case_number,
        status: data.status_text,
        statusCode: data.status,
        judge: data.judge_name,
        plaintiff: data.plaintiff_name,
        defendant: data.defendant_name,
        nextHearing: data.next_hearing_date,
        lastEvent: data.last_event_description,
        courtActs: data.court_acts_count
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Запрос отменён');
      } else {
        console.error('Ошибка при запросе к Картотеке:', error);
      }
      throw error;
    }
    */
};

/**
 * Поиск дел по ИНН участника
 * @param {string} inn - ИНН (10 или 12 цифр)
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Array>}
 */
export const searchCasesByInn = async (inn, signal) => {
    // ИМИТАЦИЯ
    console.log(`🔍 Поиск по ИНН: ${inn}`);

    await delay(1200, { signal });

    // Возвращаем 1-3 случайных дела
    const count = Math.floor(Math.random() * 3) + 1;
    const results = [];

    for (let i = 0; i < count; i++) {
        const caseNumber = `А19-${Math.floor(Math.random() * 9000 + 1000)}/${2023 + Math.floor(Math.random() * 2)}`;
        results.push(generateRandomCase(caseNumber));
    }

    return results;

    /* ========== РЕАЛЬНАЯ РЕАЛИЗАЦИЯ ==========
    const response = await fetch(`https://kad.arbitr.ru/api/search?inn=${inn}`, { signal });
    const data = await response.json();
    return data.cases;
    */
};

/**
 * Получение статуса дела в виде эмодзи
 * @param {string} statusCode - код статуса
 * @returns {string}
 */
export const getStatusEmoji = (statusCode) => {
    const emojiMap = {
        'hearing': '⚖️',
        'pending': '📅',
        'decided': '📋',
        'appeal': '⬆️',
        'suspended': '⏸️'
    };
    return emojiMap[statusCode] || '📌';
};