/**
 * Central brand + site constants. Keep all copy and external links here so
 * they can be reused across pages, metadata, and structured data.
 */
export const SITE = {
  name: "BoringBrush",
  favicon: "/icon.svg",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "BoringBrush transforms 3D avatars into physical collectibles through precision printing, artist finishing, and hand-painted detail.",
  tagline: "Digital avatars, printed into reality.",
  email: "solvex82@gmail.com",
} as const;

export const SOCIALS = {
  brand: "https://x.com/BoringBrush",
  solvex: "https://x.com/_Solvex_",
  the1: "https://x.com/the1_im_here",
} as const;

export const PARTNERS = [
  {
    name: "Solvex",
    role: "3D printing & printer control",
    blurb:
      "Solvex dials in every layer, calibrating the printers, tuning supports, and producing clean, durable models ready for the brush.",
    href: SOCIALS.solvex,
    handle: "@_Solvex_",
    image: "/partners/solvex.png",
  },
  {
    name: "The1",
    role: "Hand painting & finishing",
    blurb:
      "The1 brings each print to life with hand-mixed paint, careful shading, and the small details that give a piece its character.",
    href: SOCIALS.the1,
    handle: "@the1_im_here",
    image: "/partners/the1.png",
  },
] as const;
