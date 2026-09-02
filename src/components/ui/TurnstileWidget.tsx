'use client';

import React, { useEffect, useRef } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

export function TurnstileWidget({ siteKey, onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onVerifyRef = useRef(onVerify);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!siteKey) return;

    let isCancelled = false;
    let widgetId: string | null = null;

    const callbackName = 'cf_turnstile_callback_' + Math.random().toString(36).substring(2, 9);
    (window as any)[callbackName] = (token: string) => {
      if (!isCancelled) {
        onVerifyRef.current(token);
      }
    };

    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=cfTurnstileOnloadCallback';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const renderWidget = () => {
      if (isCancelled) return;

      const turnstile = (window as any).turnstile;
      if (turnstile && containerRef.current) {
        containerRef.current.innerHTML = '';
        const el = document.createElement('div');
        containerRef.current.appendChild(el);

        try {
          widgetId = turnstile.render(el, {
            sitekey: siteKey,
            callback: (window as any)[callbackName],
            theme: 'light',
          });
        } catch (e) {
          console.error('Turnstile render error:', e);
        }
      } else {
        setTimeout(renderWidget, 100);
      }
    };

    if (!(window as any).turnstile) {
      const existingCallback = (window as any).cfTurnstileOnloadCallback;
      (window as any).cfTurnstileOnloadCallback = () => {
        if (existingCallback) {
          try {
            existingCallback();
          } catch (e) {
            console.error(e);
          }
        }
        renderWidget();
      };
    } else {
      renderWidget();
    }

    return () => {
      isCancelled = true;
      delete (window as any)[callbackName];
      const turnstile = (window as any).turnstile;
      if (widgetId && turnstile) {
        try {
          turnstile.remove(widgetId);
        } catch (e) {
          console.error('Turnstile cleanup error:', e);
        }
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [siteKey]);

  if (!siteKey) return null;
  return (
    <div
      ref={containerRef}
      className="flex justify-start my-1 scale-[0.85] sm:scale-[0.88] origin-left"
    />
  );
}

export default TurnstileWidget;
