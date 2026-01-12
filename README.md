
# @cdek-it/typography

`@cdek-it/typography` — пакет с глобальными типографическими стилями для веб-приложений.  
Подключается один раз и применяется ко всему проекту.

---

## Установка

```bash
npm install @cdek-it/typography
````

или

```bash
yarn add @cdek-it/typography
```

---

## Подключение через CSS (рекомендуется)

Добавьте импорт в ваш глобальный CSS / SCSS файл:

```css
@import '@cdek-it/typography/dist/index.min.css';
```

> ⚠️ Импорт должен идти **до** ваших кастомных стилей, если вы планируете их переопределять.

---

## Поддерживаемые фреймворки (популярные)

### Vue 3 (Vite)

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

---

### React (Vite / Create React App)

`src/main.tsx` или `src/index.tsx`

```ts
import '@cdek-it/typography/dist/index.min.css';
import App from './App';

export default App;
```

---

### Next.js

`pages/_app.tsx` **или** `app/layout.tsx`

```ts
import '@cdek-it/typography/dist/index.min.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

---

### Nuxt 3

`nuxt.config.ts`

```ts
export default defineNuxtConfig({
  css: [
    '@cdek-it/typography/dist/index.min.css',
  ],
});
```

---

### Angular

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

```css
@import '@cdek-it/typography/dist/index.min.css';

h1 {
  font-weight: 700;
}
```

---

## Рекомендации

* Подключайте стили **один раз** на уровне приложения
* Используйте `index.min.css` в продакшене
* Не подключайте typography в `scoped` / `module` стилях
* Переопределяйте стили **после** импорта пакета

---

## Примечания

* Пакет не распространяется через CDN
* Подключение через `<link>` не поддерживается
* Для SSR-проектов используйте глобальное подключение

