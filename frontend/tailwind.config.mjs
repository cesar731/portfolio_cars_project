// tailwind.config.mjs
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',     // Azul profundo (como en la imagen)
        secondary: '#ffffff',   // Blanco puro
        text: '#f5f5f5',        // Gris claro (texto principal)
        'text-secondary': '#cccccc', // Gris medio (subtítulos)
        dark: '#000000',        // Negro absoluto
        'dark-light': '#121212', // Negro muy oscuro (tarjetas)
        border: '#333333',      // Línea sutil
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'xl': '16px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}