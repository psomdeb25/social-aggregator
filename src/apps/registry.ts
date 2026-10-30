import { siInstagram, siReddit, siWhatsapp, siYoutube } from 'simple-icons'

export interface SocialApp {
  id: string
  name: string
  url: string
  /** CSS background for the squircle tile. */
  tile: string
  /** 24×24 SVG path for the white glyph. */
  glyph: string
  /**
   * Whether the site allows being shown inside an iframe. All five v1 sites
   * send X-Frame-Options / CSP frame-ancestors headers that forbid it, so the
   * in-app view falls back to an app window instead.
   */
  frameable: boolean
}

// simple-icons dropped LinkedIn's mark; this is a plain "in" glyph.
const linkedinGlyph =
  'M5.3 3.2a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2zM3.4 9h3.8v11.6H3.4zM9.6 9h3.6v1.6c.5-.95 1.75-1.95 3.6-1.95 3.85 0 4.55 2.5 4.55 5.8v6.15h-3.8v-5.45c0-1.3-.03-2.97-1.8-2.97-1.82 0-2.1 1.42-2.1 2.88v5.54H9.6z'

export const APPS: SocialApp[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/',
    tile: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
    glyph: siInstagram.path,
    frameable: false,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/feed/',
    tile: 'linear-gradient(160deg, #1a8fd8, #0a66c2)',
    glyph: linkedinGlyph,
    frameable: false,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com/',
    tile: 'linear-gradient(160deg, #ff6a2b, #ff4500)',
    glyph: siReddit.path,
    frameable: false,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://web.whatsapp.com/',
    tile: 'linear-gradient(160deg, #5ae27f, #1ebe57)',
    glyph: siWhatsapp.path,
    frameable: false,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/',
    tile: 'linear-gradient(160deg, #ff3b3b, #e00000)',
    glyph: siYoutube.path,
    frameable: false,
  },
]
