// @ts-nocheck
import './styles/global.css';
// Импортируем функции из API Картотеки
import { validateCaseNumber, getCaseInfo, searchCasesByInn } from './services/kartotekaApi';

console.log('🚀 main.tsx запущен');

const React = window.React;
const ReactDOM = window.ReactDOM;
const { useState } = React;

// Компонент кнопки "Назад"
const BackButton = ({ onClick }) => {
  return React.createElement('button', {
    onClick: onClick,
    style: {
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: '#12204D',
      color: 'white',
      border: 'none',
      borderRadius: '8px',  // Кнопка назад оставлена 8px (маленькая)
      padding: '8px 16px',
      fontSize: '14px',
      fontFamily: 'Golos Text, sans-serif',
      cursor: 'pointer',
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }
  }, '← Назад');
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
      borderBottomLeftRadius: '10px',  // ИЗМЕНЕНО: 15px -> 10px
      borderBottomRightRadius: '10px', // ИЗМЕНЕНО: 15px -> 10px
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
      borderRadius: '10px',  // ИЗМЕНЕНО: 15px -> 10px
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      cursor: 'pointer',
      transition: 'opacity 0.2s'
    },
    helpButton: {
      width: '331px',
      height: '43px',
      border: 'none',
      borderRadius: '10px',  // ИЗМЕНЕНО: 15px -> 10px
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      cursor: 'pointer',
      marginTop: '5px',
      transition: 'opacity 0.2s'
    }
  };

  return React.createElement('div', { style: styles.container }, [
    React.createElement('div', {
      key: 'imageContainer',
      style: styles.imageContainer
    },
      React.createElement('img', {
        src: '/src/assets/images/arbcourt.jpg',
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
        React.createElement('button', {
          key: 'details',
          onClick: () => onNavigate('requisites'),
          style: {
            ...styles.menuButton,
            backgroundImage: 'url(/src/assets/images/detailsbtn.svg)'
          }
        }),

        React.createElement('button', {
          key: 'case',
          onClick: () => onNavigate('case-status'),
          style: {
            ...styles.menuButton,
            backgroundImage: 'url(/src/assets/images/casestatusbtn.svg)'
          }
        })
      ]),

      React.createElement('div', { key: 'row2', style: styles.buttonsRow }, [
        React.createElement('button', {
          key: 'schedule',
          onClick: () => onNavigate('schedule'),
          style: {
            ...styles.menuButton,
            backgroundImage: 'url(/src/assets/images/shedulebtn.svg)'
          }
        }),

        React.createElement('button', {
          key: 'contacts',
          onClick: () => onNavigate('contacts'),
          style: {
            ...styles.menuButton,
            backgroundImage: 'url(/src/assets/images/contactsbtn.svg)'
          }
        })
      ]),

      React.createElement('button', {
        key: 'help',
        onClick: () => onNavigate('help'),
        style: {
          ...styles.helpButton,
          backgroundImage: 'url(/src/assets/images/helpbtn.svg)'
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
      borderRadius: '10px',  // ИЗМЕНЕНО: 20px -> 10px
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

// Страница статуса дела (с использованием API)
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
          // Показываем первое дело, в реальности нужно показывать список
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
      borderRadius: '10px',  // ИЗМЕНЕНО: 10px (было 10px, оставил)
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'Golos Text, sans-serif',
      maxWidth: '150px'
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
      borderRadius: '10px',  // ИЗМЕНЕНО: 12px -> 10px
      fontSize: '16px',
      marginBottom: '15px',
      fontFamily: 'Golos Text, sans-serif'
    },
    button: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#12204D',
      color: 'white',
      border: 'none',
      borderRadius: '10px',  // ИЗМЕНЕНО: 12px -> 10px
      fontSize: '18px',
      cursor: 'pointer',
      fontFamily: 'Golos Text, sans-serif'
    },
    hint: { color: '#6F7B8C', fontSize: '14px', marginBottom: '15px' },
    card: {
      marginTop: '20px',
      padding: '22px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',  // ИЗМЕНЕНО: 20px -> 10px
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
        ? 'Формат: буква А, дефис, номер, слеш, год'
        : 'ИНН юридического лица (10 цифр) или ИП (12 цифр)'
    ),

    React.createElement('button', {
      key: 'button',
      onClick: handleSearch,
      disabled: loading,
      style: { ...styles.button, opacity: loading ? 0.7 : 1 }
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

// Страница графика работы
const Schedule = ({ onBack }) => React.createElement('div', { style: { padding: '22px' } }, [
  React.createElement(BackButton, { key: 'back', onClick: onBack }),
  React.createElement('h2', { style: { color: '#12204D', marginTop: '50px', marginBottom: '25px' } }, '📅 График работы'),
  React.createElement('div', { style: { background: '#f8f9fa', padding: '20px', borderRadius: '10px' } }, [  // ИЗМЕНЕНО: 15px -> 10px
    React.createElement('p', { key: '1', style: { marginBottom: '10px' } }, 'Пн-Чт: 9:00 - 18:00'),
    React.createElement('p', { key: '2', style: { marginBottom: '10px' } }, 'Пятница: 9:00 - 16:45'),
    React.createElement('p', { key: '3', style: { marginBottom: '10px' } }, 'Обед: 13:00 - 13:45')
  ])
]);

// Страница контактов
const Contacts = ({ onBack }) => React.createElement('div', { style: { padding: '22px' } }, [
  React.createElement(BackButton, { key: 'back', onClick: onBack }),
  React.createElement('h2', { style: { color: '#12204D', marginTop: '50px', marginBottom: '25px' } }, '📞 Контакты'),
  React.createElement('div', { style: { background: '#f8f9fa', padding: '20px', borderRadius: '10px' } }, [  // ИЗМЕНЕНО: 15px -> 10px
    React.createElement('p', { key: '1', style: { marginBottom: '10px' } }, 'г. Иркутск, ул. Дзержинского, 36А'),
    React.createElement('p', { key: '2', style: { marginBottom: '10px' } }, '📞 8 (3952) 20-10-00'),
    React.createElement('p', { key: '3', style: { marginBottom: '10px' } }, '📧 info@irkutsk.arbitr.ru')
  ])
]);

// Страница помощи
const Help = ({ onBack }) => React.createElement('div', { style: { padding: '22px' } }, [
  React.createElement(BackButton, { key: 'back', onClick: onBack }),
  React.createElement('h2', { style: { color: '#12204D', marginTop: '50px', marginBottom: '25px' } }, '❓ Помощь'),
  React.createElement('div', { style: { background: '#f8f9fa', padding: '20px', borderRadius: '10px' } }, [  // ИЗМЕНЕНО: 15px -> 10px
    React.createElement('p', { key: '1', style: { marginBottom: '10px' } }, '📁 Статус дела: введите номер А19-12345/2024'),
    React.createElement('p', { key: '2', style: { marginBottom: '10px' } }, '🏛 Реквизиты: актуальные реквизиты для оплаты'),
    React.createElement('p', { key: '3', style: { marginBottom: '10px' } }, '📞 По всем вопросам: 8 (3952) 20-10-00')
  ])
]);

// Основной компонент приложения
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

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