/**
 * Проверка fonts.css для CI: файл описывает обе гарнитуры ДС и пригоден
 * для подключения с CDN. Бинарники в репозитории не лежат (лицензия
 * TT Fellows), поэтому проверяется только структура CSS и ссылки.
 *
 * Запуск: npm run fonts:check
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cssPath = path.join(root, 'fonts.css')

const failures = []
const fail = (message) => {
  failures.push(message)
  console.error(`  ✗ ${message}`)
}

const css = await readFile(cssPath, 'utf8').catch(() => '')
if (!css) {
  fail('fonts.css не найден или пуст')
} else {
  if (!css.startsWith('@charset "UTF-8";')) fail('нет @charset "UTF-8" в начале файла')

  const blocks = css.split('@font-face').slice(1)
  if (blocks.length !== 9) fail(`@font-face: ${blocks.length}, ожидалось 9`)

  for (const [family, weight] of [
    ['TT Fellows', 400],
    ['TT Fellows', 600],
    ['Noto Sans', 400],
    ['Noto Sans', 700],
  ]) {
    const rule = new RegExp(
      `@font-face\\s*\\{[^}]*font-family:\\s*'${family}'[^}]*font-weight:\\s*${weight}\\b`,
    )
    if (!rule.test(css)) fail(`нет @font-face ${family} ${weight}`)
  }

  const files = new Set()
  for (const block of blocks) {
    const url = block.match(/url\('fonts\/([^']+\.woff2)'\)/)
    const rules = [
      [/font-display:\s*swap/, 'font-display: swap'],
      [/unicode-range:\s*U\+/, 'unicode-range'],
      [/format\('woff2'\)/, "format('woff2')"],
      [/font-style:\s*normal/, 'font-style: normal'],
    ]
    if (!url) {
      fail(`нет url('fonts/...woff2') в блоке ${block.trim().slice(0, 48)}…`)
      continue
    }
    files.add(url[1])
    for (const [pattern, label] of rules) {
      if (!pattern.test(block)) fail(`${url[1]}: нет ${label}`)
    }
  }

  if (files.size !== blocks.length) fail('имена файлов шрифтов повторяются')

  console.log(`fonts.css: ${blocks.length} @font-face, ${files.size} файлов шрифтов`)
}

if (failures.length) {
  console.error(`\nПровалено проверок: ${failures.length}`)
  process.exit(1)
}
console.log('OK: fonts.css соответствует контракту подключения')
