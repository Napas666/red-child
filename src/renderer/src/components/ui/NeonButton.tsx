import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  icon?: string
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, rgba(255,0,48,0.9) 0%, rgba(180,0,30,0.9) 100%)',
    border: '1px solid rgba(255,0,48,0.8)',
    color: '#ffffff',
    boxShadow: '0 0 20px rgba(255,0,48,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
  },
  secondary: {
    background: 'rgba(255,0,48,0.08)',
    border: '1px solid rgba(255,0,48,0.4)',
    color: '#ff3355'
  },
  ghost: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)'
  },
  danger: {
    background: 'rgba(255,50,50,0.1)',
    border: '1px solid rgba(255,50,50,0.5)',
    color: '#ff5555'
  }
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '12px', borderRadius: '4px' },
  md: { padding: '10px 22px', fontSize: '13px', borderRadius: '6px' },
  lg: { padding: '14px 32px', fontSize: '15px', borderRadius: '8px' }
}

export default function NeonButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  size = 'md',
  icon
}: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: '0.05em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        textTransform: 'uppercase'
      }}
    >
      {icon && <span style={{ fontSize: size === 'sm' ? '14px' : '16px' }}>{icon}</span>}
      {children}
    </motion.button>
  )
}
