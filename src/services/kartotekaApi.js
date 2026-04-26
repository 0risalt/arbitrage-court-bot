// src/services/kartotekaApi.js
import { supabase } from '../lib/supabaseClient'

/**
 * Проверка формата номера дела
 */
export const validateCaseNumber = (caseNumber) => {
    const pattern = /^[АA]\d{2,3}-\d+\/\d{4}$/;
    return pattern.test(caseNumber);
};

/**
 * Получение информации о деле по номеру
 * Возвращает объект дела или null, если не найдено
 */
export const getCaseInfo = async (caseNumber, signal) => {
    try {
        const query = supabase
            .from('court_cases')
            .select('*')
            .eq('case_number', caseNumber)
            .maybeSingle();

        if (signal) {
            query.abortSignal(signal);
        }

        const { data, error } = await query;

        if (error) throw error;

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
        if (error.name === 'AbortError') {
            console.log('Запрос отменён');
        } else {
            console.error('Ошибка запроса к Supabase:', error);
        }
        throw error;
    }
};

/**
 * Поиск дел по ИНН (точный поиск по полю inn)
 * @param {string} inn - ИНН (10 или 12 цифр)
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>} массив найденных дел
 */
export const searchCasesByInn = async (inn, signal) => {
    try {
        const query = supabase
            .from('court_cases')
            .select('*')
            .eq('inn', inn)   // точный поиск по полю inn
            .order('created_at', { ascending: false });

        if (signal) {
            query.abortSignal(signal);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data && data.length > 0) {
            return data.map(item => ({
                number: item.case_number,
                status: item.status,
                statusCode: item.status_code,
                judge: item.judge,
                plaintiff: item.plaintiff,
                defendant: item.defendant,
                nextHearing: item.next_hearing
                    ? new Date(item.next_hearing).toLocaleDateString('ru-RU')
                    : null,
                lastEvent: item.last_event,
                courtActs: item.court_acts
            }));
        }

        return []; // если ничего не найдено
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Запрос отменён');
        } else {
            console.error('Ошибка поиска по ИНН:', error);
        }
        throw error;
    }
};

/**
 * Эмодзи для статуса дела
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