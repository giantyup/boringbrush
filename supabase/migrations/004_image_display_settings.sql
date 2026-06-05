-- Per-item and per-collection image display controls for public cards.

alter table public.gallery_items
  add column if not exists display_fit text not null default 'contain'
    check (display_fit in ('contain', 'cover')),
  add column if not exists display_bg text not null default 'studio-grey'
    check (display_bg in ('studio-grey', 'white', 'cream', 'sky')),
  add column if not exists display_aspect text not null default 'square'
    check (display_aspect in ('square', 'portrait', 'landscape', 'wide'));

alter table public.collections
  add column if not exists cover_display_fit text not null default 'contain'
    check (cover_display_fit in ('contain', 'cover')),
  add column if not exists cover_display_bg text not null default 'studio-grey'
    check (cover_display_bg in ('studio-grey', 'white', 'cream', 'sky')),
  add column if not exists cover_display_aspect text not null default 'landscape'
    check (cover_display_aspect in ('square', 'portrait', 'landscape', 'wide'));
