import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        senseboxGreen: '#669933',
        senseboxBlue: '#00cccc',
        senseboxYellow: '#ffcc33',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        float1: {
          '0%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '50%': {
            transform: 'translateY(-15px) translateX(10px) rotate(5deg)',
          },
          '100%': {
            transform: 'translateY(10px) translateX(-10px) rotate(-5deg)',
          },
        },
        float2: {
          '0%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '50%': {
            transform: 'translateY(20px) translateX(-5px) rotate(-3deg)',
          },
          '100%': {
            transform: 'translateY(-15px) translateX(8px) rotate(3deg)',
          },
        },
        float3: {
          '0%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '50%': {
            transform: 'translateY(-10px) translateX(15px) rotate(4deg)',
          },
          '100%': {
            transform: 'translateY(15px) translateX(-5px) rotate(-4deg)',
          },
        },
      },
      animation: {
        float1: 'float1 10s infinite alternate ease-in-out',
        float2: 'float2 12s infinite alternate ease-in-out',
        float3: 'float3 8s infinite alternate ease-in-out',
      },
    },
    plugins: [tailwindcssAnimate],
  },
} as Config
