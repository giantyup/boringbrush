-- Image position and scale controls for card display.

alter table public.gallery_items
  add column if not exists display_scale integer not null default 100
    check (display_scale between 50 and 200),
  add column if not exists display_pos_x numeric(5, 2) not null default 0
    check (display_pos_x between -50 and 50),
  add column if not exists display_pos_y numeric(5, 2) not null default 0
    check (display_pos_y between -50 and 50);

alter table public.collections
  add column if not exists cover_display_scale integer not null default 100
    check (cover_display_scale between 50 and 200),
  add column if not exists cover_display_pos_x numeric(5, 2) not null default 0
    check (cover_display_pos_x between -50 and 50),
  add column if not exists cover_display_pos_y numeric(5, 2) not null default 0
    check (cover_display_pos_y between -50 and 50);
