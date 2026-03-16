// @ts-nocheck
import './styles/global.css';

const { useEffect } = window.React;
const { HashRouter, Routes, Route } = window.ReactRouterDOM || {};

// Простая главная страница
const MainPage = () => {
  return window.React.createElement('div', {
    style: {
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'Golos Text, sans-serif'
    }
  }, [
    window.React.createElement('h1', {
      key: 'title',
      style: { color: '#12204D', fontSize: '24px', marginBottom: '20px' }
    }, 'Арбитражный суд Иркутской области'),

    window.React.createElement('p', {
      key: 'text',
      style: { color: '#6F7B8C', fontSize: '18px' }
    }, 'Приложение работает!'),

    window.React.createElement('div', {
      key: 'links',
      style: { marginTop: '30px' }
    }, [
      window.React.createElement('a', {
        key: 'req',
        href: '#/requisites',
        style: { display: 'block', margin: '10px', color: '#12204D' }
      }, 'Реквизиты'),

      window.React.createElement('a', {
        key: 'case',
        href: '#/case-status',
        style: { display: 'block', margin: '10px', color: '#12204D' }
      }, 'Статус дела')
    ])
  ]);
};

// Простая страница реквизитов
const RequisitesPage = () => {
  useEffect(() => {
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => {
        window.Telegram.WebApp.BackButton.hide();
        window.location.hash = '#/';
      });
    }
    return () => {
      if (window.Telegram?.WebApp?.BackButton) {
        window.Telegram.WebApp.BackButton.hide();
      }
    };
  }, []);

  return window.React.createElement('div', {
    style: { padding: '20px', fontFamily: 'Golos Text, sans-serif' }
  }, [
    window.React.createElement('h2', { key: 'title' }, '🏛 Реквизиты'),
    window.React.createElement('p', { key: 'text' }, 'ИНН: 380000000000'),
    window.React.createElement('p', { key: 'text2' }, 'КПП: 380001001')
  ]);
};

// Простая страница статуса дела
const CaseStatusPage = () => {
  useEffect(() => {
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => {
        window.Telegram.WebApp.BackButton.hide();
        window.location.hash = '#/';
      });
    }
    return () => {
      if (window.Telegram?.WebApp?.BackButton) {
        window.Telegram.WebApp.BackButton.hide();
      }
    };
  }, []);

  return window.React.createElement('div', {
    style: { padding: '20px', fontFamily: 'Golos Text, sans-serif' }
  }, [
    window.React.createElement('h2', { key: 'title' }, '📁 Статус дела'),
    window.React.createElement('p', { key: 'text' }, 'Введите номер дела: А19-12345/2024')
  ]);
};

const App = () => {
  useEffect(() => {
    console.log('App загружен');
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  if (!window.ReactRouterDOM) {
    return window.React.createElement('div', null, 'Загрузка...');
  }

  return window.React.createElement(HashRouter, null,
    window.React.createElement('div', { className: 'app-container' },
      window.React.createElement(Routes, null, [
        window.React.createElement(Route, {
          key: 'home',
          path: '/',
          element: window.React.createElement(MainPage, null)
        }),
        window.React.createElement(Route, {
          key: 'req',
          path: '/requisites',
          element: window.React.createElement(RequisitesPage, null)
        }),
        window.React.createElement(Route, {
          key: 'case',
          path: '/case-status',
          element: window.React.createElement(CaseStatusPage, null)
        })
      ])
    )
  );
};

export default App;