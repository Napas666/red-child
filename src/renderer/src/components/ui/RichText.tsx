import type { ReactNode } from 'react'
import Tooltip from './Tooltip'
import { glossary } from '../../data/glossary'

// Сортируем термины по длине (длинные первыми) чтобы "SQL Injection" нашлось раньше "SQL"
const sortedTerms = Object.keys(glossary).sort((a, b) => b.length - a.length)

// Regex с word boundaries (с учётом спецсимволов типа "C&C", "AFL++")
function buildPattern(): RegExp {
  const escaped = sortedTerms.map((t) =>
    t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )
  return new RegExp(`(?<![\\w/])(${escaped.join('|')})(?![\\w/])`, 'gi')
}

const TERM_PATTERN = buildPattern()

/** Разбивает строку на части — обычный текст и термины с тултипами */
function injectTooltips(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let lastIndex = 0
  const regex = new RegExp(TERM_PATTERN.source, TERM_PATTERN.flags)

  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    // Текст до совпадения
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const raw = match[0]
    const key = raw.toLowerCase()
    const entry = glossary[key]
    if (entry) {
      parts.push(
        <Tooltip key={`${match.index}-${raw}`} term={raw} entry={entry} />
      )
    } else {
      parts.push(raw)
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts
}

// ── Блоки рендеринга ──────────────────────────────────────────────────────

function renderInline(text: string): ReactNode[] {
  // Сначала разбираем backtick code spans, потом bold, потом tooltips
  const result: ReactNode[] = []
  const codeOrBold = /(`[^`]+`|\*\*[^*]+\*\*)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = codeOrBold.exec(text)) !== null) {
    if (m.index > last) {
      result.push(...injectTooltips(text.slice(last, m.index)))
    }
    const chunk = m[0]
    if (chunk.startsWith('`')) {
      result.push(
        <code
          key={m.index}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88em',
            background: 'rgba(255,0,48,0.12)',
            border: '1px solid rgba(255,0,48,0.22)',
            padding: '1px 5px',
            borderRadius: 3,
            color: '#ff6080'
          }}
        >
          {chunk.slice(1, -1)}
        </code>
      )
    } else {
      result.push(
        <strong key={m.index} style={{ color: 'var(--text)', fontWeight: 700 }}>
          {injectTooltips(chunk.slice(2, -2))}
        </strong>
      )
    }
    last = codeOrBold.lastIndex
  }
  if (last < text.length) result.push(...injectTooltips(text.slice(last)))
  return result
}

interface RichTextProps {
  content: string
}

export default function RichText({ content }: RichTextProps) {
  const lines = content.split('\n')
  const nodes: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Пустая строка
    if (line.trim() === '') {
      nodes.push(<div key={`gap-${i}`} style={{ height: 6 }} />)
      i++
      continue
    }

    // H3: **Заголовок**
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      nodes.push(
        <h3
          key={i}
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 13,
            color: 'var(--red)',
            letterSpacing: '0.08em',
            margin: '18px 0 8px',
            textShadow: 'var(--red-glow-sm)'
          }}
        >
          {line.trim().slice(2, -2)}
        </h3>
      )
      i++
      continue
    }

    // Таблица
    if (line.trim().startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!lines[i].match(/^\s*\|[\s\-|]+\|\s*$/)) {
          tableLines.push(lines[i])
        }
        i++
      }
      const [header, ...rows] = tableLines.map((l) =>
        l.split('|').filter(Boolean).map((c) => c.trim())
      )
      nodes.push(
        <div key={`table-${i}`} style={{ margin: '12px 0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            {header && (
              <thead>
                <tr>
                  {header.map((h, ci) => (
                    <th key={ci} style={{ color: 'var(--red)', padding: '6px 12px', borderBottom: '1px solid var(--border)', textAlign: 'left', letterSpacing: '0.06em' }}>
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '5px 12px', color: 'var(--text-2)' }}>
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Список — собираем все подряд идущие bullet строки
    if (line.trimStart().startsWith('- ') || /^\d+\.\s/.test(line.trimStart())) {
      const items: string[] = []
      while (
        i < lines.length &&
        (lines[i].trimStart().startsWith('- ') || /^\d+\.\s/.test(lines[i].trimStart()))
      ) {
        items.push(lines[i].replace(/^(\s*-\s|\s*\d+\.\s)/, ''))
        i++
      }
      nodes.push(
        <ul key={`list-${i}`} style={{ margin: '6px 0 10px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map((item, ii) => (
            <li key={ii} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, listStyleType: 'none', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }}>◆</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Обычный абзац
    nodes.push(
      <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 4 }}>
        {renderInline(line)}
      </p>
    )
    i++
  }

  return <>{nodes}</>
}
