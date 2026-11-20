/**
 * Сборка шрифтов дизайн-системы: сабсеты + @font-face (DS-877).
 *
 * Исходники — fonts-src/:
 *   NotoSans-*.ttf, NotoSansArmenian-*.ttf, NotoSansGeorgian-*.ttf,
 *   NotoSansMath-Regular.ttf, tt-fellows/TT-Fellows-*.ttf
 *
 * Результат:
 *   fonts/*.woff2 — сабсеты, которые уезжают на CDN;
 *   fonts.css     — @font-face с unicode-range, сгенерированным из тех же
 *                   диапазонов (одно место правды: CSS не может разъехаться
 *                   с фактическим покрытием сабсетов).
 *
 * URL в fonts.css относительные (`fonts/...`): файл лежит на CDN рядом с
 * каталогом fonts/, поэтому и прямой <link>, и @import резолвят их от
 * https://public-static.cdek.ru/common/ds/. Благодаря этому же файл можно
 * проверить локально, подняв статический сервер в корне репозитория.
 *
 * Диапазоны — фильтр «что оставить из исходника»: символы, отсутствующие
 * в cmap исходника, в сабсет не попадают. Стрелки ← ↑ → ↓ в базовом
 * Noto Sans отсутствуют — берём их из Noto Sans Math; армянский и грузинский
 * живут в отдельных шрифтах семейства Noto.
 *
 * Запуск: npm run fonts
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SRC_DIR = path.join(root, 'fonts-src')
const OUT_DIR = path.join(root, 'fonts')

let subsetFont
try {
  ;({ default: subsetFont } = await import('subset-font'))
} catch {
  // Зависимость — devDependency; без неё сабсеттинг невозможен, но это
  // осознанная деградация сборки, а не поломка установки потребителей.
  console.error('[build-fonts] subset-font не установлен — npm install')
  process.exit(1)
}

/** Базовое покрытие: латиница, кириллица (ru/uk/be/kk/sr), типографика, валюты. */
const BASE_RANGES = [
  [0x0020, 0x007e], // Basic Latin: ASCII + пунктуация + $
  [0x00a0, 0x00ff], // Latin-1: NBSP, ©, °, «», ×, ·, £, ¥
  [0x0100, 0x017f], // Latin Extended-A: ł, š, ū и пр.
  [0x0400, 0x04ff], // Кириллица: весь блок (ru, uk, be, kk, sr…)
  [0x0500, 0x052f], // Cyrillic Supplement (қ ң ө ұ ү һ і ї є ґ ў…)
  [0x2010, 0x2027], // — – ‘ ’ “ ” … • † ‡
  [0x2030, 0x203a], // ‰ ‹ ›
  [0x20a0, 0x20cf], // Валюты: € ₽ ₴ ₸ ₼ ₾ ₺ и пр. (весь блок)
  [0x2116, 0x2116], // №
  [0x2122, 0x2122], // ™
  [0x2212, 0x2212], // − (минус)
]

/**
 * Стрелки ← ↑ → ↓: в Noto Sans их нет (by design семейства), берём из
 * Noto Sans Math. Один статический файл на оба веса — для 700 браузер
 * использует тот же дизайн (синтез жирности не критичен для стрелок).
 */
const ARROW_RANGES = [[0x2190, 0x2193]]

/**
 * Армянский (hy): буквы U+0530-058F + знак драма ֏ U+058F. В базовом
 * Noto Sans армянского нет — отдельный шрифт семейства, инстанцированный
 * в статические Regular/Bold из variable (wght+wdth) upstream-файла.
 */
const ARMENIAN_RANGES = [[0x0530, 0x058f]]

/**
 * Грузинский (ka): Mkhetruli U+10A0-10FF, Mtavruli U+1C90-1CBF (заглавные
 * для выделения), Georgian Supplement U+2D00-2D2F (асомтаврули и пр.).
 * В базовом Noto Sans грузинского нет — отдельный шрифт семейства.
 */
const GEORGIAN_RANGES = [
  [0x10a0, 0x10ff],
  [0x1c90, 0x1cbf],
  [0x2d00, 0x2d2f],
]

/**
 * TT Fellows — акцидентный шрифт заголовков. В типографике ДС используются
 * Regular (400) и DemiBold (600): все .title-* набраны demibold.
 * Сабсеттим по тому же базовому покрытию, что и Noto Sans, — так заголовок
 * с редким символом уходит в системный fallback, а не тянет полный файл.
 */
const FONT_SPECS = [
  {
    file: 'TTFellows-Regular.woff2',
    source: 'tt-fellows/TT-Fellows-Regular.ttf',
    family: 'TT Fellows',
    weight: '400',
    ranges: BASE_RANGES,
  },
  {
    file: 'TTFellows-DemiBold.woff2',
    source: 'tt-fellows/TT-Fellows-DemiBold.ttf',
    family: 'TT Fellows',
    weight: '600',
    ranges: BASE_RANGES,
  },
  {
    file: 'NotoSans-Regular.woff2',
    source: 'NotoSans-Regular.ttf',
    family: 'Noto Sans',
    weight: '400',
    ranges: BASE_RANGES,
  },
  {
    file: 'NotoSans-Bold.woff2',
    source: 'NotoSans-Bold.ttf',
    family: 'Noto Sans',
    weight: '700',
    ranges: BASE_RANGES,
  },
  {
    file: 'NotoSansMath-Arrows.woff2',
    source: 'NotoSansMath-Regular.ttf',
    family: 'Noto Sans',
    weight: '400 700',
    ranges: ARROW_RANGES,
  },
  {
    file: 'NotoSansArmenian-Regular.woff2',
    source: 'NotoSansArmenian-Regular.ttf',
    family: 'Noto Sans',
    weight: '400',
    ranges: ARMENIAN_RANGES,
  },
  {
    file: 'NotoSansArmenian-Bold.woff2',
    source: 'NotoSansArmenian-Bold.ttf',
    family: 'Noto Sans',
    weight: '700',
    ranges: ARMENIAN_RANGES,
  },
  {
    file: 'NotoSansGeorgian-Regular.woff2',
    source: 'NotoSansGeorgian-Regular.ttf',
    family: 'Noto Sans',
    weight: '400',
    ranges: GEORGIAN_RANGES,
  },
  {
    file: 'NotoSansGeorgian-Bold.woff2',
    source: 'NotoSansGeorgian-Bold.ttf',
    family: 'Noto Sans',
    weight: '700',
    ranges: GEORGIAN_RANGES,
  },
]

const toText = (ranges) =>
  ranges
    .flatMap(([from, to]) => {
      const chars = []
      for (let cp = from; cp <= to; cp++) chars.push(String.fromCodePoint(cp))
      return chars
    })
    .join('')

const toUnicodeRange = (ranges) =>
  ranges.map(([from, to]) => `U+${from.toString(16)}-${to.toString(16)}`).join(', ')

await mkdir(OUT_DIR, { recursive: true })

const cssRules = []
for (const spec of FONT_SPECS) {
  const source = await readFile(path.join(SRC_DIR, spec.source))
  const subset = await subsetFont(source, toText(spec.ranges), { targetFormat: 'woff2' })
  await writeFile(path.join(OUT_DIR, spec.file), subset)
  console.log(`${spec.file}: ${source.length} → ${subset.length} байт`)
  cssRules.push(`@font-face {
  font-family: '${spec.family}';
  src: url('fonts/${spec.file}') format('woff2');
  font-weight: ${spec.weight};
  font-style: normal;
  font-display: swap;
  unicode-range: ${toUnicodeRange(spec.ranges)};
}`)
}

const header = `@charset "UTF-8";
/* Сгенерировано scripts/build-fonts.mjs — не редактировать руками.
   Шрифты дизайн-системы CDEK: TT Fellows (заголовки) и Noto Sans (текст).
   Файлы лежат рядом, в fonts/; unicode-range соответствует их покрытию.
   Регенерация: npm run fonts */

`
await writeFile(path.join(root, 'fonts.css'), header + cssRules.join('\n\n') + '\n')

console.log('fonts.css: обновлён')
