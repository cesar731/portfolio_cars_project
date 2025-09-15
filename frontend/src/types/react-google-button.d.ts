// frontend/src/types/react-google-button.d.ts

declare module 'react-google-button' {
  import { ReactNode } from 'react';

  interface GoogleButtonProps {
    onClick: () => void;
    style?: React.CSSProperties;
    children?: ReactNode;
    // Puedes agregar más props si las usas
  }

  const GoogleButton: React.FC<GoogleButtonProps>;
  export default GoogleButton;
}