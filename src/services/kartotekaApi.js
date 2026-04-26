// src/services/kartotekaApi.js
import { supabase } from '../lib/supabaseClient'

/**
 * Проверка формата номера дела
 * @param {string} caseNumber - номер дела (например, "А19-12345/2024")
 * @returns {boolean}
 */
export const validateCaseNumber = (caseNumber) => {
    const pattern = /^[АA]\d{2,3}-\d+\/\d{4}$/;
    return pattern.test(caseNumber);
};

/**
 * Получение информации о деле по его номеру
 * @param {string} caseNumber - номер дела
 * @param {AbortSignal} [signal] - сигнал для отмены запроса
 * @returns {Promise<Object|null>} - данные дела или null, если не найдено
 */
export const getCaseInfo = async (caseNumber, signal) => {
    try {
        // Формируем запрос к Supabase
        const query = supabase
            .from('court_cases')
            .select('*')
            .eq('case_number', caseNumber)
            .maybeSingle(); // ВАЖНО: гарантирует один объект или null

        // Применяем AbortSignal, если он передан
        if (signal) {
            query.abortSignal(signal);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Ошибка Supabase:', error.message);
            throw error;
        }

        // Если запись найдена, преобразуем поля в формат фронтенда
        if (data) {
            return {
                number: data.case_number,
                status: data.status,
                statusCode: data.status_code,
                judge: data.judge,
                plaintiff: data.plaintiff,
                defendant: data.defendant,
                nextHearing: data.next_hearing
                    ? new Date(data.next_hearing).toLocaleDateString('ru-RU')
                    : null,
                lastEvent: data.last_event,
                courtActs: data.court_acts
            };
        }

        // Дело не найдено
        return null;
    } catch (error) {
        // Не выводим ошибку, если запрос был отменён
        if (error.name === 'AbortError') {
            console.log('Запрос отменён');
        } else {
            console.error('Ошибка запроса к Supabase:', error);
        }
        throw error;
    }
};

/**
 * Поиск дел по ИНН (заглушка)
 * @param {string} inn - ИНН (10 или 12 цифр)
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export const searchCasesByInn = async (inn, signal) => {
    // Пока не реализовано – возвращаем пустой массив
    console.warn('Функция поиска по ИНН ещё не реализована');
    return [];
};

/**
 * Возвращает эмодзи для статуса дела
 * @param {string} statusCode - код статуса (hearing, decided и т.д.)
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