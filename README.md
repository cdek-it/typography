# @cdek-it/typography

`@cdek-it/typography` — пакет с глобальными типографическими стилями для веб-приложений.  
Подключается один раз и применяется ко всему проекту.

---

## Подключение через HTML (рекомендуется)

Для улучшения производительности рекомендуется использовать preconnect:

```html
<link rel="preconnect" href="https://public-static.cdek.ru" />
<link rel="stylesheet" href="https://public-static.cdek.ru/common/typography/v3.0.1/typography.min.css">
```

> ⚠️ Подключение должно идти **до** ваших кастомных стилей, если вы планируете их переопределять.
---

## Альтернативные способы подключения

### Установка через npm/yarn

```bash
npm install @cdek-it/typography
```

или

```bash
yarn add @cdek-it/typography
```

Импорт в CSS/SCSS файл:

```css
@import '@cdek-it/typography/dist/index.min.css';
```

### Поддерживаемые фреймворки (популярные)

#### Vue 3 (Vite)

`src/assets/main.css`

```css
@import '@cdek-it/typography/dist/index.min.css';
```

`src/main.ts`

```ts
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';

createApp(App).mount('#app');
```

#### React (Vite / Create React App)

`src/main.tsx` или `src/index.tsx`

```ts
import '@cdek-it/typography/dist/index.min.css';
import App from './App';

export default App;
```

#### Next.js

`pages/_app.tsx` **или** `app/layout.tsx`

```ts
import '@cdek-it/typography/dist/index.min.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

#### Nuxt 3

`nuxt.config.ts`

```ts
export default defineNuxtConfig({
  css: [
    '@cdek-it/typography/dist/index.min.css',
  ],
});
```

#### Angular

`angular.json`

```json
{
  "styles": [
    "node_modules/@cdek-it/typography/dist/index.min.css",
    "src/styles.css"
  ]
}
```

---

## Переопределение стилей

Вы можете переопределять стили typography в своих файлах:

```html
<link rel="preconnect" href="https://public-static.cdek.ru" />
<link rel="stylesheet" href="https://public-static.cdek.ru/common/typography/v3.0.1/typography.min.css">
<style>
  h1 {
    font-weight: 700;
  }
</style>
```

---

## Рекомендации

* Подключайте стили **один раз** на уровне приложения
* Используйте `typography.min.css` в продакшене
* Не подключайте typography в `scoped` / `module` стилях
* Переопределяйте стили **после** подключения пакета
* Используйте preconnect для улучшения производительности загрузки

---

## Темная тема (хак)

Для включения темной темы используйте JavaScript:

```javascript
document.documentElement.dataset.theme = 'dark';
```

> ⚠️ Это решение-хак для случаев, когда не используются библиотеки Prime для переключения темы. В штатных ситуациях рекомендуется использовать встроенные механизмы управления темами.