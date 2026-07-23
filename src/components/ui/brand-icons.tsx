import type { SVGProps } from "react";

/**
 * Official colored brand marks for external services only (TZ design rule:
 * brand SVGs for external links; Lucide for the interface; no emoji).
 * Each is decorative by default (aria-hidden) — the accessible name comes
 * from the surrounding link's label.
 */

type IconProps = SVGProps<SVGSVGElement>;

export function TelegramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="12" fill="#229ED9" />
      <path
        fill="#fff"
        d="M5.49 11.77 16.9 7.37c.53-.19 1 .13.82.94l-1.94 9.15c-.13.61-.5.76-1 .47l-2.76-2.03-1.33 1.28c-.15.15-.27.27-.55.27l.2-2.8 5.1-4.6c.22-.2-.05-.31-.34-.12l-6.3 3.97-2.72-.85c-.59-.19-.6-.59.13-.87Z"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
      <defs>
        <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-gradient)" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        d="M7.5 4.75h9A2.75 2.75 0 0 1 19.25 7.5v9a2.75 2.75 0 0 1-2.75 2.75h-9A2.75 2.75 0 0 1 4.75 16.5v-9A2.75 2.75 0 0 1 7.5 4.75Z"
      />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.4" cy="7.6" r="1.1" fill="#fff" />
    </svg>
  );
}

export function GoogleMapsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
      <path
        fill="#1A73E8"
        d="M12 2a7 7 0 0 0-7 7c0 4.7 5.9 11.6 6.2 11.9a1 1 0 0 0 1.6 0C13.1 20.6 19 13.7 19 9a7 7 0 0 0-7-7Z"
      />
      <path
        fill="#EA4335"
        d="M12 2a7 7 0 0 0-6 3.4l4.7 3.9A2.6 2.6 0 0 1 12 6.4a2.6 2.6 0 0 1 2.4 1.5l3.2-3.8A7 7 0 0 0 12 2Z"
      />
      <path
        fill="#34A853"
        d="M9.5 12.7c-.5-.6-.8-1.1-1-1.6L6 5.4A7 7 0 0 0 5 9c0 2 1 4.3 2.3 6.4l2.2-2.7Z"
      />
      <path
        fill="#FBBC04"
        d="M14.6 8.3c.3.5.4 1 .4 1.7a2.9 2.9 0 0 1-.6 1.8c-.6.8-2 2.5-2.7 3.8l3.9-4.6c.4-.5.7-.9 1-1.5l-2-1Z"
      />
      <circle cx="12" cy="9.2" r="2.5" fill="#fff" />
    </svg>
  );
}

export function YandexMapsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" {...props}>
      <path
        fill="#FF4433"
        d="M12 2c-3.9 0-7 3-7 6.9 0 5 6.1 12 6.6 12.6.2.3.6.3.8 0C13 20.9 19 14 19 8.9 19 5 15.9 2 12 2Z"
      />
      <circle cx="12" cy="9" r="2.6" fill="#fff" />
    </svg>
  );
}
