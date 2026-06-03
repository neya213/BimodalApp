export const DESIGN = {
  colors: {
    navy: '#1A2342',
    coral: '#FF4D4D',
    borderLight: '#EBEFF5',
    textMuted: '#768299',
    
    light: {
      bg: '#FFFFFF',
      canvas: '#F9FAFC',
      card: '#F4F6F9',
      text: '#111111',
      border: '#EBEFF5',
    },
    
    dark: {
      bg: '#0A0E1A',
      canvas: '#05070F',
      card: '#0E1424',
      text: '#FFFFFF',
      border: '#2D395E',
    }
  },
  
  theme: (isDarkMode: boolean) => ({
    bg: isDarkMode ? '#0A0E1A' : '#FFFFFF',
    canvas: isDarkMode ? '#05070F' : '#F9FAFC',
    card: isDarkMode ? '#0E1424' : '#F4F6F9',
    text: isDarkMode ? '#FFFFFF' : '#111111',
    border: isDarkMode ? '#2D395E' : '#EBEFF5',
  })
};