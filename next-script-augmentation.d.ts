// next-script-augmentation.d.ts
import 'next/script';

declare module 'next/script' {
  interface ScriptProps {
    chat?: string;
  }
}
