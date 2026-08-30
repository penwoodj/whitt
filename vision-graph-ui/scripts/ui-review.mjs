import { chromium } from 'playwright'
import { spawn, execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgDir = fileURLToPath(new URL('..', import.meta.url))
const repoRoot = resolve(pkgDir, '..')

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : null
}

const topic = arg('topic') || 'review'
const useDev = process.argv.includes('--dev')
const port = Number(arg('port') || (useDev ? 5173 : 4173))
const base = `http://localhost:${port}`

const stamp = new Date().toISOString().slice(0, 10)
const outDir = resolve(repoRoot, 'docs', 'ui-reviews', `${stamp}-${topic}`)
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const audit = { consoleErrors: [], failedRequests: [], unstyledInputs: [] }

const runServer = () =>
  useDev
    ? spawn('npx', ['vite', '--port', String(port), '--strictPort'], { cwd: pkgDir, stdio: 'ignore', detached: true })
    : (execSync('npx vite build', { cwd: pkgDir, stdio: 'inherit' }),
       spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], { cwd: pkgDir, stdio: 'ignore', detached: true }))

const server = runServer()

const waitForServer = async (url, ms = 45000) => {
  const deadline = Date.now() + ms
  while (Date.now() < deadline) {
    try {
      await fetch(url)
      return true
    } catch {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  return false
}

const up = await waitForServer(base)
if (!up) {
  server.kill()
  throw new Error(`server never came up on ${base}`)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('console', (m) => { if (m.type() === 'error') audit.consoleErrors.push(m.text().slice(0, 200)) })
page.on('requestfailed', (r) => audit.failedRequests.push(r.url().slice(0, 120)))

const scanUnstyled = () =>
  page.evaluate(() => {
    const offenders = []
    for (const el of document.querySelectorAll('input, textarea, select')) {
      const cs = getComputedStyle(el)
      const bg = cs.backgroundColor
      const isWhite = bg === 'rgb(255, 255, 255)'
      const isTransparent = bg === 'rgba(0, 0, 0, 0)'
      const hasBorder = cs.borderWidth !== '0px' && cs.borderStyle !== 'none'
      const hasGlow = cs.boxShadow !== 'none'
      if ((isWhite || (isTransparent && !hasBorder && !hasGlow))) {
        offenders.push(
          `${el.tagName.toLowerCase()} name=${el.getAttribute('name') ?? el.getAttribute('data-testid') ?? '?'} bg=${bg} border=${cs.borderWidth} ${cs.borderStyle} shadow=${cs.boxShadow === 'none' ? 'none' : 'yes'}`
        )
      }
    }
    return offenders
  })

const shots = []

const capture = async (label) => {
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.waitForTimeout(900)
    const file = `${label}-${vp.name}.png`
    await page.screenshot({ path: resolve(outDir, file), fullPage: true })
    shots.push(file)
    const offenders = await scanUnstyled()
    for (const o of offenders) audit.unstyledInputs.push(`${file}: ${o}`)
  }
}

await page.goto(base, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(800)
await capture('01-picker')

const projectBtn = await page.locator('button[aria-label]').first()
if (await projectBtn.count()) {
  await projectBtn.click()
  await page.waitForTimeout(1800)
  await capture('02-graph')

  const node = page.locator('.react-flow__node').first()
  if (await node.count()) {
    await node.click({ force: true })
    await page.waitForTimeout(900)
    await capture('03-node-focused')
  }
}

await browser.close()
try { process.kill(-server.pid) } catch { server.kill() }

const auditLine = (label, items) =>
  items.length === 0 ? `- ${label}: NONE` : items.map((i) => `- ${label}: ${i}`).join('\n')

const abs = (f) => resolve(outDir, f)
const reviewMd = `# UI Review — ${topic}

Date: ${new Date().toISOString()}
Surface: ${useDev ? 'dev server' : 'production build (vite preview)'}
Round: ${arg('round') || 1}

## Screenshots (absolute paths)

${shots.map((f) => `- \`${abs(f)}\``).join('\n')}

## Embedded

${shots.map((f) => `![${f}](./${f})`).join('\n')}

## Audit

${auditLine('console error', audit.consoleErrors)}
${auditLine('failed request', audit.failedRequests)}
${auditLine('unstyled input', audit.unstyledInputs)}

## Verdict

${audit.consoleErrors.length + audit.unstyledInputs.length === 0 ? 'demo-eligible: audit clean' : 'NOT demo-eligible: fix audit findings above'}
`
writeFileSync(resolve(outDir, 'REVIEW.md'), reviewMd)

console.log(`OUT_DIR=${outDir}`)
console.log(`SHOTS=${shots.length}`)
console.log(`CONSOLE_ERRORS=${audit.consoleErrors.length}`)
console.log(`UNSTYLED_INPUTS=${audit.unstyledInputs.length}`)
audit.unstyledInputs.slice(0, 20).forEach((u) => { console.log(`UNSTYLED ${u}`) })
audit.consoleErrors.slice(0, 10).forEach((e) => { console.log(`CONSOLE ${e}`) })
