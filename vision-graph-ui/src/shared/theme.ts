export type Theme = {
  colors: {
    bg: string
    bgElevated: string
    bgHover: string
    border: string
    borderActive: string
    text: string
    textMuted: string
    textInverse: string
    primary: string
    primaryHover: string
    success: string
    warning: string
    error: string
    recording: string
    idle: string
    running: string
    done: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  radius: {
    sm: string
    md: string
    lg: string
    pill: string
  }
  font: {
    sans: string
    mono: string
    sizeXs: string
    sizeSm: string
    sizeMd: string
    sizeLg: string
    sizeXl: string
    weightNormal: number
    weightMedium: number
    weightBold: number
  }
  shadow: {
    sm: string
    md: string
    lg: string
  }
  transition: {
    fast: string
    base: string
    slow: string
  }
  zIndex: {
    base: number
    overlay: number
    modal: number
    tooltip: number
  }
  glow: {
    primary: string
    primaryStrong: string
    recording: string
    recordingPulse: string
    done: string
    idle: string
  }
  fishEye: {
    transitionDuration: string
    scaleActive: number
    scaleHover: number
    blurDistant: string
    opacityDistant: number
  }
  cinematic: {
    bgGradient: string
    noiseOpacity: number
    vignetteStrength: number
  }
}

export const darkTheme = {
  colors: {
    bg: '#0a0a0a',
    bgElevated: '#141414',
    bgHover: '#1f1f1f',
    border: '#2a2a2a',
    borderActive: '#3a3a3a',
    text: '#e0e0e0',
    textMuted: '#888',
    textInverse: '#0a0a0a',
    primary: '#4a9eff',
    primaryHover: '#6bb0ff',
    success: '#4ade80',
    warning: '#facc15',
    error: '#ef4444',
    recording: '#ef4444',
    idle: '#666',
    running: '#4a9eff',
    done: '#4ade80',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    pill: '9999px',
  },
  font: {
    sans: 'system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, monospace',
    sizeXs: '11px',
    sizeSm: '13px',
    sizeMd: '15px',
    sizeLg: '18px',
    sizeXl: '24px',
    weightNormal: 400,
    weightMedium: 500,
    weightBold: 700,
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 4px 8px rgba(0, 0, 0, 0.5)',
    lg: '0 12px 24px rgba(0, 0, 0, 0.6)',
  },
  transition: {
    fast: '120ms ease',
    base: '200ms ease',
    slow: '400ms ease',
  },
  zIndex: {
    base: 1,
    overlay: 100,
    modal: 1000,
    tooltip: 10000,
  },
  glow: {
    primary: '0 0 12px rgba(74, 158, 255, 0.4)',
    primaryStrong: '0 0 20px rgba(74, 158, 255, 0.6)',
    recording: '0 0 16px rgba(239, 68, 68, 0.5)',
    recordingPulse: '0 0 24px rgba(239, 68, 68, 0.8)',
    done: '0 0 12px rgba(74, 222, 128, 0.4)',
    idle: '0 0 8px rgba(102, 102, 102, 0.2)',
  },
  fishEye: {
    transitionDuration: '400ms',
    scaleActive: 1.05,
    scaleHover: 1.02,
    blurDistant: '2px',
    opacityDistant: 0.6,
  },
  cinematic: {
    bgGradient: 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #0a0a0a 70%)',
    noiseOpacity: 0.02,
    vignetteStrength: 0.4,
  },
} satisfies Theme

export const theme = darkTheme
