// @ts-nocheck
import './styles/global.css';
// Импортируем функции из API Картотеки
import { validateCaseNumber, getCaseInfo, searchCasesByInn } from './services/kartotekaApi';

console.log('🚀 main.tsx запущен');

const React = window.React;
const ReactDOM = window.ReactDOM;
const { useState, useEffect } = React;

// Компонент кнопки "Назад" с анимацией
const BackButton = ({ onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  return React.createElement('button', {
    onClick: (e) => {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      onClick(e);
    },
    style: {
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: '#12204D',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontFamily: 'Golos Text, sans-serif',
      cursor: 'pointer',
      zIndex: 1000,
      boxShadow: isPressed ? '0 1px 2px rgba(0,0,0,0.2)' : '0 2px 5px rgba(0,0,0,0.2)',
      transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      transition: 'transform 0.1s, box-shadow 0.1s'
    }
  }, '← Назад');
};

// Компонент кнопки с анимацией нажатия
const AnimatedButton = ({ onClick, children, style }) => {
  const [isPressed, setIsPressed] = useState(false);

  return React.createElement('button', {
    onClick: (e) => {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      onClick(e);
    },
    style: {
      ...style,
      cursor: 'pointer',
      transition: 'transform 0.1s, box-shadow 0.1s, opacity 0.2s',
      transform: isPressed ? 'scale(0.97)' : 'scale(1)',
      boxShadow: isPressed ? '0 1px 3px rgba(0,0,0,0.1)' : (style.boxShadow || '0 2px 8px rgba(0,0,0,0.1)')
    }
  }, children);
};

// Главная страница
const Home = ({ onNavigate }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '0 22px 30px 22px'
    },
    imageContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: 0
    },
    headerImage: {
      width: '331px',
      height: '221px',
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
      objectFit: 'cover'
    },
    welcomeText: {
      fontFamily: 'Golos Text, sans-serif',
      fontWeight: 600,
      fontSize: '20px',
      color: '#000000',
      textAlign: 'center',
      marginTop: '30px',
      marginBottom: 0,
      padding: '0 10px',
      lineHeight: 1.3
    },
    menuGrid: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      marginTop: '30px'
    },
    buttonsRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: '15px',
      gap: '15px'
    },
    menuButton: {
      width: '160px',
      height: '130px',
      border: 'none',
      borderRadius: '10px',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      cursor: 'pointer',
      transition: 'transform 0.1s, box-shadow 0.1s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    helpButton: {
      width: '331px',
      height: '43px',
      border: 'none',
      borderRadius: '10px',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      cursor: 'pointer',
      marginTop: '5px',
      transition: 'transform 0.1s, box-shadow 0.1s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
  };

  // Кнопка с анимацией
  const ButtonWithAnimation = ({ onClick, children, buttonStyle }) => {
    const [isPressed, setIsPressed] = useState(false);
    return React.createElement('button', {
      onClick: (e) => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
        onClick(e);
      },
      style: {
        ...buttonStyle,
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.1s, box-shadow 0.1s'
      }
    }, children);
  };

  return React.createElement('div', { style: styles.container }, [
    React.createElement('div', {
      key: 'imageContainer',
      style: styles.imageContainer
    },
      React.createElement('img', {
        src: '/images/arbcourt.jpg',
        alt: 'Арбитражный суд',
        style: styles.headerImage
      })
    ),

    React.createElement('h1', {
      key: 'title',
      style: styles.welcomeText
    }, 'Добро пожаловать в чат-бот Арбитражного суда Иркутской области!'),

    React.createElement('div', { key: 'menu', style: styles.menuGrid }, [
      React.createElement('div', { key: 'row1', style: styles.buttonsRow }, [
        React.createElement(ButtonWithAnimation, {
          key: 'details',
          onClick: () => onNavigate('requisites'),
          buttonStyle: {
            ...styles.menuButton,
            backgroundImage: 'url(/images/detailsbtn.svg)'
          }
        }),
        React.createElement(ButtonWithAnimation, {
          key: 'case',
          onClick: () => onNavigate('case-status'),
          buttonStyle: {
            ...styles.menuButton,
            backgroundImage: 'url(/images/casestatusbtn.svg)'
          }
        })
      ]),
      React.createElement('div', { key: 'row2', style: styles.buttonsRow }, [
        React.createElement(ButtonWithAnimation, {
          key: 'schedule',
          onClick: () => onNavigate('schedule'),
          buttonStyle: {
            ...styles.menuButton,
            backgroundImage: 'url(/images/shedulebtn.svg)'
          }
        }),
        React.createElement(ButtonWithAnimation, {
          key: 'contacts',
          onClick: () => onNavigate('contacts'),
          buttonStyle: {
            ...styles.menuButton,
            backgroundImage: 'url(/images/contactsbtn.svg)'
          }
        })
      ]),
      React.createElement(ButtonWithAnimation, {
        key: 'help',
        onClick: () => onNavigate('help'),
        buttonStyle: {
          ...styles.helpButton,
          backgroundImage: 'url(/images/helpbtn.svg)'
        }
      })
    ])
  ]);
};

// Страница реквизитов
const Requisites = ({ onBack }) => {
  const styles = {
    container: {
      padding: '22px',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    },
    title: {
      color: '#12204D',
      fontSize: '24px',
      marginBottom: '25px',
      textAlign: 'center',
      marginTop: '50px'
    },
    card: {
      backgroundColor: '#f8f9fa',
      padding: '22px',
      borderRadius: '10px',
      border: '1px solid #e9ecef'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px dashed #e9ecef'
    },
    label: {
      color: '#6F7B8C',
      textAlign: 'left'
    },
    value: {
      color: '#12204D',
      fontWeight: 500,
      textAlign: 'right'
    }
  };

  return React.createElement('div', { style: styles.container }, [
    React.createElement(BackButton, { key: 'back', onClick: onBack }),
    React.createElement('h2', { key: 'title', style: styles.title }, '🏛 Реквизиты'),
    React.createElement('div', { key: 'card', style: styles.card }, [
      ['Получатель', 'УФК по Иркутской области'],
      ['ИНН', '380000000000'],
      ['КПП', '380001001'],
      ['БИК', '012520123'],
      ['Счет', '03100643000000013400'],
      ['КБК', '18210801000011000110']
    ].map(([label, value], i) =>
      React.createElement('div', { key: i, style: styles.row }, [
        React.createElement('span', { style: styles.label }, label),
        React.createElement('span', { style: styles.value }, value)
      ])
    ))
  ]);
};

// Страница статуса дела
const CaseStatus = ({ onBack }) => {
  const [caseNumber, setCaseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState('number');

  const handleSearch = async () => {
    setError('');
    setCaseData(null);

    if (!caseNumber.trim()) {
      setError('Введите номер дела или ИНН');
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    try {
      if (searchMode === 'number') {
        if (!validateCaseNumber(caseNumber)) {
          setError('Неверный формат. Используйте: А19-12345/2024');
          setLoading(false);
          return;
        }

        const data = await getCaseInfo(caseNumber, signal);
        setCaseData(data);
      } else {
        if (!/^\d{10,12}$/.test(caseNumber)) {
          setError('ИНН должен содержать 10 или 12 цифр');
          setLoading(false);
          return;
        }

        const results = await searchCasesByInn(caseNumber, signal);
        if (results.length === 0) {
          setError('Дел по данному ИНН не найдено');
        } else if (results.length === 1) {
          setCaseData(results[0]);
        } else {
          setCaseData(results[0]);
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Ошибка при получении данных');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '22px',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    },
    title: {
      color: '#12204D',
      fontSize: '24px',
      marginBottom: '25px',
      textAlign: 'center',
      marginTop: '50px'
    },
    modeSelector: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
      justifyContent: 'center'
    },
    modeButton: {
      flex: 1,
      padding: '10px',
      border: '2px solid #6F7B8C',
      background: 'white',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'Golos Text, sans-serif',
      maxWidth: '150px',
      transition: 'all 0.2s'
    },
    activeMode: {
      background: '#12204D',
      color: 'white',
      borderColor: '#12204D'
    },
    input: {
      width: '100%',
      padding: '15px',
      border: '2px solid #6F7B8C',
      borderRadius: '10px',
      fontSize: '16px',
      marginBottom: '15px',
      fontFamily: 'Golos Text, sans-serif',
      transition: 'border-color 0.2s'
    },
    button: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#12204D',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '18px',
      cursor: 'pointer',
      fontFamily: 'Golos Text, sans-serif',
      transition: 'transform 0.1s, background-color 0.2s'
    },
    hint: { color: '#6F7B8C', fontSize: '14px', marginBottom: '15px' },
    card: {
      marginTop: '20px',
      padding: '22px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      border: '1px solid #e9ecef'
    },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    error: { color: 'red', textAlign: 'center', marginBottom: '15px' }
  };

  return React.createElement('div', { style: styles.container }, [
    React.createElement(BackButton, { key: 'back', onClick: onBack }),
    React.createElement('h2', { key: 'title', style: styles.title }, '📁 Статус дела'),

    React.createElement('div', { key: 'mode', style: styles.modeSelector }, [
      React.createElement('button', {
        key: 'number',
        onClick: () => setSearchMode('number'),
        style: {
          ...styles.modeButton,
          ...(searchMode === 'number' ? styles.activeMode : {})
        }
      }, 'По номеру дела'),

      React.createElement('button', {
        key: 'inn',
        onClick: () => setSearchMode('inn'),
        style: {
          ...styles.modeButton,
          ...(searchMode === 'inn' ? styles.activeMode : {})
        }
      }, 'По ИНН')
    ]),

    React.createElement('input', {
      key: 'input',
      type: 'text',
      placeholder: searchMode === 'number' ? 'А19-12345/2024' : 'Введите ИНН (10 или 12 цифр)',
      value: caseNumber,
      onChange: (e) => setCaseNumber(e.target.value),
      style: styles.input
    }),

    React.createElement('div', { key: 'hint', style: styles.hint },
      searchMode === 'number'
        ? 'Формат: буква А, дефис, номер, слеш, год (пример: А19-12345/2024)'
        : 'ИНН юридического лица (10 цифр) или ИП (12 цифр)'
    ),

    React.createElement(AnimatedButton, {
      key: 'button',
      onClick: handleSearch,
      style: styles.button
    }, loading ? 'Поиск...' : 'Найти'),

    error && React.createElement('div', { key: 'error', style: styles.error }, error),

    caseData && React.createElement('div', { key: 'card', style: styles.card }, [
      ['Номер дела:', caseData.number],
      ['Статус:', caseData.status],
      ['Судья:', caseData.judge],
      ['Истец:', caseData.plaintiff],
      ['Ответчик:', caseData.defendant],
      caseData.nextHearing && ['Следующее заседание:', caseData.nextHearing],
      caseData.lastEvent && ['Последнее событие:', caseData.lastEvent]
    ].filter(Boolean).map(([label, value], i) =>
      React.createElement('div', { key: i, style: styles.row }, [
        React.createElement('span', { style: { color: '#6F7B8C' } }, label),
        React.createElement('span', { style: { color: '#12204D', fontWeight: 500 } }, value)
      ])
    ))
  ]);
};

// Страница графика работы (расширенная)
const Schedule = ({ onBack }) => {
  const [selectedJudge, setSelectedJudge] = useState(null);

  const judgesSchedule = {
    'Иванова М.А.': ['Пн 10:00', 'Ср 14:00', 'Пт 11:00'],
    'Петров С.В.': ['Вт 09:30', 'Чт 15:00', 'Пт 10:30'],
    'Сидорова Е.Н.': ['Пн 14:00', 'Ср 11:00', 'Чт 16:00'],
    'Козлов Д.И.': ['Вт 11:00', 'Чт 10:00', 'Пт 14:30'],
    'Смирнова О.П.': ['Пн 09:00', 'Ср 15:30', 'Пт 09:30']
  };

  const styles = {
    container: { padding: '22px', backgroundColor: '#ffffff', minHeight: '100vh' },
    title: { color: '#12204D', fontSize: '24px', marginBottom: '15px', marginTop: '50px', textAlign: 'center' },
    subtitle: { color: '#6F7B8C', fontSize: '14px', textAlign: 'center', marginBottom: '20px' },
    sectionTitle: { color: '#12204D', fontSize: '18px', fontWeight: 600, marginTop: '20px', marginBottom: '10px' },
    card: { background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '15px' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '5px', borderBottom: '1px dashed #e9ecef' },
    judgeButton: {
      width: '100%',
      padding: '12px',
      marginBottom: '8px',
      background: '#ffffff',
      border: '1px solid #6F7B8C',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'Golos Text, sans-serif',
      transition: 'all 0.2s'
    },
    activeJudge: {
      background: '#12204D',
      color: 'white',
      borderColor: '#12204D'
    },
    scheduleList: {
      marginTop: '10px',
      paddingLeft: '20px'
    }
  };

  const judgeNames = Object.keys(judgesSchedule);

  return React.createElement('div', { style: styles.container }, [
    React.createElement(BackButton, { key: 'back', onClick: onBack }),
    React.createElement('h2', { key: 'title', style: styles.title }, '📅 График работы'),

    React.createElement('div', { key: 'general', style: styles.card }, [
      React.createElement('div', { key: 'gen1', style: styles.row }, [
        React.createElement('span', null, 'Пн-Чт:'), React.createElement('span', { style: { fontWeight: 500 } }, '9:00 - 18:00')
      ]),
      React.createElement('div', { key: 'gen2', style: styles.row }, [
        React.createElement('span', null, 'Пятница:'), React.createElement('span', { style: { fontWeight: 500 } }, '9:00 - 16:45')
      ]),
      React.createElement('div', { key: 'gen3', style: styles.row }, [
        React.createElement('span', null, 'Обед:'), React.createElement('span', { style: { fontWeight: 500 } }, '13:00 - 13:45')
      ]),
      React.createElement('div', { key: 'gen4', style: styles.row }, [
        React.createElement('span', null, 'Прием документов:'), React.createElement('span', { style: { fontWeight: 500 } }, 'Пн-Чт 9:00-17:00, Пт 9:00-15:45')
      ])
    ]),

    React.createElement('div', { key: 'judges', style: { marginTop: '20px' } }, [
      React.createElement('h3', { key: 'judgesTitle', style: styles.sectionTitle }, '👨‍⚖️ График заседаний судей'),
      React.createElement('div', { key: 'judgesList', style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        judgeNames.map(judge =>
          React.createElement('button', {
            key: judge,
            onClick: () => setSelectedJudge(selectedJudge === judge ? null : judge),
            style: {
              ...styles.judgeButton,
              ...(selectedJudge === judge ? styles.activeJudge : {})
            }
          }, [
            React.createElement('span', { key: 'name' }, judge),
            selectedJudge === judge && React.createElement('div', { key: 'schedule', style: styles.scheduleList },
              judgesSchedule[judge].map((time, idx) =>
                React.createElement('div', { key: idx, style: { marginTop: '5px', fontSize: '14px' } }, time)
              )
            )
          ])
        )
      )
    ])
  ]);
};

// Страница контактов (с картой)
// Страница контактов (с картой и исправленным отображением телефонов)
const Contacts = ({ onBack }) => {
  const styles = {
    container: { padding: '22px', backgroundColor: '#ffffff', minHeight: '100vh' },
    title: { color: '#12204D', fontSize: '24px', marginBottom: '15px', marginTop: '50px', textAlign: 'center' },
    card: { background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '15px' },
    row: { marginBottom: '12px' },
    label: { color: '#6F7B8C', fontSize: '14px', marginBottom: '4px' },
    value: { color: '#12204D', fontWeight: 500, fontSize: '16px' },
    mapContainer: { marginTop: '15px', borderRadius: '10px', overflow: 'hidden', height: '200px' },
    phoneRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px dashed #e9ecef',
      flexWrap: 'wrap',
      gap: '8px'
    },
    phoneDept: {
      color: '#6F7B8C',
      fontSize: '15px',
      flexShrink: 0
    },
    phoneNum: {
      fontWeight: 600,
      color: '#12204D',
      fontSize: '15px',
      textAlign: 'right',
      flexShrink: 0
    }
  };

  const phones = [
    { dept: 'Приемная председателя', num: '8 (3952) 20-10-01' },
    { dept: 'Канцелярия', num: '8 (3952) 20-10-02' },
    { dept: 'Справочная', num: '8 (3952) 20-10-00' },
    { dept: 'Отдел делопроизводства', num: '8 (3952) 20-10-03' }
  ];

  // Правильные координаты для ул. Седова, 76, Иркутск
  // Яндекс карта с меткой на Седова 76
  // Правильные координаты для ул. Седова, 76, Иркутск
  const mapUrl = 'https://yandex.ru/map-widget/v1/?um=constructor%3A1&source=constructor&ll=104.283500%2C52.278500&z=17&pt=104.283500%2C52.278500%2Cpm2orgm';

  return React.createElement('div', { style: styles.container }, [
    React.createElement(BackButton, { key: 'back', onClick: onBack }),
    React.createElement('h2', { key: 'title', style: styles.title }, '📞 Контакты'),

    React.createElement('div', { key: 'address', style: styles.card }, [
      React.createElement('div', { key: 'addr', style: styles.row }, [
        React.createElement('div', { style: styles.label }, 'Адрес'),
        React.createElement('div', { style: styles.value }, 'г. Иркутск, ул. Седова, 76')
      ]),
      React.createElement('div', { key: 'map', style: styles.mapContainer },
        React.createElement('iframe', {
          src: mapUrl,
          width: '100%',
          height: '100%',
          frameBorder: '0',
          style: { border: 0 },
          title: 'Карта расположения Арбитражного суда Иркутской области'
        })
      )
    ]),

    React.createElement('div', { key: 'phones', style: styles.card }, [
      React.createElement('div', { key: 'phoneTitle', style: { ...styles.label, marginBottom: '10px', fontWeight: 600 } }, 'Телефоны'),
      ...phones.map((phone, idx) =>
        React.createElement('div', { key: idx, style: styles.phoneRow }, [
          React.createElement('span', { style: styles.phoneDept }, phone.dept),
          React.createElement('span', { style: styles.phoneNum }, phone.num)
        ])
      )
    ]),

    React.createElement('div', { key: 'other', style: styles.card }, [
      React.createElement('div', { key: 'email', style: styles.row }, [
        React.createElement('div', { style: styles.label }, 'Email'),
        React.createElement('div', { style: styles.value }, 'info@irkutsk.arbitr.ru')
      ]),
      React.createElement('div', { key: 'web', style: styles.row }, [
        React.createElement('div', { style: styles.label }, 'Сайт'),
        React.createElement('div', { style: styles.value }, 'https://irkutsk.arbitr.ru')
      ])
    ])
  ]);
};

// Страница помощи (расширенная)
const Help = ({ onBack }) => {
  const styles = {
    container: { padding: '22px', backgroundColor: '#ffffff', minHeight: '100vh' },
    title: { color: '#12204D', fontSize: '24px', marginBottom: '15px', marginTop: '50px', textAlign: 'center' },
    card: { background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '15px' },
    sectionTitle: { color: '#12204D', fontWeight: 600, fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
    text: { color: '#6F7B8C', fontSize: '15px', lineHeight: 1.5, marginBottom: '8px', paddingLeft: '12px' },
    example: { background: '#e9ecef', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#12204D', marginTop: '8px', fontFamily: 'monospace' },
    tip: { background: '#e9ecef', padding: '12px', borderRadius: '8px', marginTop: '12px', fontSize: '14px' }
  };

  return React.createElement('div', { style: styles.container }, [
    React.createElement(BackButton, { key: 'back', onClick: onBack }),
    React.createElement('h2', { key: 'title', style: styles.title }, '❓ Помощь'),

    React.createElement('div', { key: 'case', style: styles.card }, [
      React.createElement('div', { style: styles.sectionTitle }, '📁 Статус дела'),
      React.createElement('div', { style: styles.text }, 'Для проверки статуса дела введите номер в формате:'),
      React.createElement('div', { style: styles.example }, 'А19-12345/2024'),
      React.createElement('div', { style: styles.text }, 'Где А19 — код суда (Иркутская область), 12345 — номер дела, 2024 — год'),
      React.createElement('div', { style: styles.text }, 'Также доступен поиск по ИНН организации (10 или 12 цифр)')
    ]),

    React.createElement('div', { key: 'requisites', style: styles.card }, [
      React.createElement('div', { style: styles.sectionTitle }, '🏛 Реквизиты'),
      React.createElement('div', { style: styles.text }, 'Актуальные реквизиты для оплаты государственной пошлины.'),
      React.createElement('div', { style: styles.text }, 'Всегда проверяйте актуальность на официальном сайте суда.')
    ]),

    React.createElement('div', { key: 'schedule', style: styles.card }, [
      React.createElement('div', { style: styles.sectionTitle }, '📅 График работы'),
      React.createElement('div', { style: styles.text }, 'Суд работает: Пн-Чт 9:00-18:00, Пт 9:00-16:45'),
      React.createElement('div', { style: styles.text }, 'Прием документов: Пн-Чт 9:00-17:00, Пт 9:00-15:45'),
      React.createElement('div', { style: styles.text }, 'Графики заседаний судей можно посмотреть в разделе "График работы"')
    ]),

    React.createElement('div', { key: 'contacts', style: styles.card }, [
      React.createElement('div', { style: styles.sectionTitle }, '📞 Контакты'),
      React.createElement('div', { style: styles.text }, 'Если бот не помог, обратитесь по телефону:'),
      React.createElement('div', { style: { ...styles.example, fontWeight: 600, textAlign: 'center' } }, '8 (3952) 20-10-00'),
      React.createElement('div', { style: styles.text }, 'Режим работы справочной: Пн-Чт 9:00-18:00, Пт 9:00-16:45')
    ]),

    React.createElement('div', { key: 'tip', style: styles.tip }, [
      React.createElement('div', { style: { fontWeight: 600, marginBottom: '5px' } }, '💡 Совет:'),
      React.createElement('div', { style: styles.text }, 'Для ускорения поиска дела используйте номер в точном формате. Если дело не найдено, проверьте правильность ввода.')
    ])
  ]);
};

// Основной компонент приложения
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Инициализация Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const goHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'requisites') {
    return React.createElement(Requisites, { onBack: goHome });
  }
  if (currentPage === 'case-status') {
    return React.createElement(CaseStatus, { onBack: goHome });
  }
  if (currentPage === 'schedule') {
    return React.createElement(Schedule, { onBack: goHome });
  }
  if (currentPage === 'contacts') {
    return React.createElement(Contacts, { onBack: goHome });
  }
  if (currentPage === 'help') {
    return React.createElement(Help, { onBack: goHome });
  }

  return React.createElement(Home, { onNavigate: navigate });
};

// Рендеринг
const root = document.getElementById('root');
if (root && ReactDOM?.createRoot) {
  ReactDOM.createRoot(root).render(React.createElement(App));
  console.log('✅ Приложение отрендерено');
}