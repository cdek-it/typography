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

## Шрифты дизайн-системы (TT Fellows и Noto Sans)

Типографика ссылается на `TT Fellows` (заголовки) и `Noto Sans` (текст), но не встраивает
их в `typography.min.css`. Шрифты подключаются отдельным файлом, общим для всех продуктов:

```html
<link rel="preconnect" href="https://public-static.cdek.ru" crossorigin />
<link rel="stylesheet" href="https://public-static.cdek.ru/common/ds/fonts.css">
```

Через CSS:

```css
@import url('https://public-static.cdek.ru/common/ds/fonts.css');
```

> `@import` должен идти первым в файле — до остальных правил.

| Семейство  | Веса      | Назначение                  |
| ---------- | --------- | --------------------------- |
| TT Fellows | 400, 600  | Заголовки (`--fontFamily-heading`) |
| Noto Sans  | 400, 700  | Текст (`--fontFamily-base`) |

Noto Sans дополнительно покрывает армянский и грузинский, а стрелки `← ↑ → ↓` берутся из
Noto Sans Math. У всех `@font-face` включён `font-display: swap`, а `unicode-range`
прописан по фактическому покрытию сабсетов: браузер скачивает только те `fonts/*.woff2`,
которые нужны странице. Курсивных начертаний в дизайн-системе нет — они не поставляются.

### Сборка

`fonts.css` — готовый файл: он лежит в репозитории и выкладывается на CDN вместе с `fonts/`.
Сами `.woff2` и исходники в репозитории не хранятся (лицензия TT Fellows): страницы подключают
только `fonts.css`.

Локальный предпросмотр: поднимите статический сервер в корне репозитория и откройте
`preview/fonts-preview.html?css=/fonts.css` (без параметра — прод-ссылка).

> TT Fellows — коммерческий шрифт. Исходники и собранные `.woff2` не коммитятся (см. `.gitignore`)
> и не публикуются в npm; выкладывать их на публичный CDN можно только при наличии
> лицензии на web-использование.

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

## Слои каскада (`@layer`)

Начиная с версии `4.0.0` стили пакета живут в слое `components`, а сам пакет объявляет
порядок слоёв:

```css
@layer theme, base, components, utilities;
```

Это значит, что утилиты Tailwind и токен-утилиты переопределяют цвет текста **без `!`**:

```html
<h2 class="title-h2 text-white">Заголовок на тёмном фоне</h2>
<p class="body-regular-base text-color-secondary">Подпись</p>
```

Работает при любом порядке подключения — и когда пакет импортирован до Tailwind, и когда после.

### Переопределение стилей

Обычный CSS вне слоёв сильнее любого слоя, поэтому такое переопределение работает как раньше:

```html
<link rel="preconnect" href="https://public-static.cdek.ru" />
<link rel="stylesheet" href="https://public-static.cdek.ru/common/typography/v3.0.1/typography.min.css">
<style>
  h1 {
    font-weight: 700;
  }
</style>
```

Переопределять можно и из своего слоя `components` — при условии, что он подключён после пакета:

```css
@import '@cdek-it/typography/dist/index.min.css';

@layer components {
  .title-h2 {
    font-weight: 700;
  }
}
```

### Миграция с 3.x

* Обходы вида `text-white!` продолжают работать, чистить их можно постепенно
* Если вы переопределяли типографику из слоя `base` — перенесите правила в `components`
  или в обычный CSS вне слоёв

---

## Рекомендации

* Подключайте стили **один раз** на уровне приложения
* Используйте `typography.min.css` в продакшене
* Не подключайте typography в `scoped` / `module` стилях
* Переопределяйте стили **после** подключения пакета — см. раздел «Слои каскада»
* Используйте preconnect для улучшения производительности загрузки

---

## Темная тема (хак)

Для включения темной темы используйте JavaScript:

```javascript
document.documentElement.dataset.theme = 'dark';
```

> ⚠️ Это решение-хак для случаев, когда не используются библиотеки Prime для переключения темы. В штатных ситуациях рекомендуется использовать встроенные механизмы управления темами.