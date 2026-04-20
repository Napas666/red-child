import { useEffect, useRef } from 'react'

interface Props {
  text: string
  className?: string
  style?: React.CSSProperties
  tag?: 'h1' | 'h2' | 'h3' | 'span' | 'p'
}

export default function GlitchText({ text, className = '', style, tag: Tag = 'span' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timeoutId: ReturnType<typeof setTimeout>

    const triggerGlitch = () => {
      el.classList.add('glitching')
      setTimeout(() => el.classList.remove('glitching'), 300 + Math.random() * 200)
      timeoutId = setTimeout(triggerGlitch, 3000 + Math.random() * 7000)
    }

    timeoutId = setTimeout(triggerGlitch, 1000 + Math.random() * 3000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <style>{`
        .glitch-wrap {
          position: relative;
          display: inline-block;
          animation: flicker 8s infinite;
        }
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          opacity: 0;
        }
        .glitch-wrap.glitching::before {
          opacity: 0.7;
          color: #00f0ff;
          animation: glitch-1 0.3s steps(1) forwards;
        }
        .glitch-wrap.glitching::after {
          opacity: 0.7;
          color: #ff0080;
          animation: glitch-2 0.3s steps(1) forwards;
        }
      `}</style>
      <Tag
        ref={ref as React.RefObject<HTMLHeadingElement>}
        className={`glitch-wrap ${className}`}
        data-text={text}
        style={style}
      >
        {text}
      </Tag>
    </>
  )
}
