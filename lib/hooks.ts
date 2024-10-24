import { useCallback, useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { BREAKPOINTS } from './constants';

export function useOutsideClick(ref: React.RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

export function useIsBreakpoint(breakpoint: keyof typeof BREAKPOINTS = 'md') {
  const [isBreakpoint, setIsBreakpoint] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
    const callback = (media: MediaQueryListEvent) => setIsBreakpoint(media.matches);
    setIsBreakpoint(media.matches);

    media.addEventListener('change', callback);

    return () => {
      media.removeEventListener('change', callback);
    };
  }, []);

  return isBreakpoint;
}

export function useRecaptcha() {
  const [token, setToken] = useState<string | undefined>();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const _handleRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      console.error('ReCAPTCHA not loaded');
      return;
    }

    try {
      const token = await executeRecaptcha('email_signup');
      setToken(token);
    } catch (error) {
      console.error('Error executing ReCAPTCHA:', error);
    }
  }, [executeRecaptcha]);

  const refresh = async () => {
    await _handleRecaptcha();
  };

  useEffect(() => {
    if (!executeRecaptcha || token) return;

    void _handleRecaptcha();
  }, [executeRecaptcha, token, _handleRecaptcha]);

  return { token, refresh };
}
