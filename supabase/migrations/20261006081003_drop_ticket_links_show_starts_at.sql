-- The show time now comes from shows.starts_at through ticket_links.show_id.
alter table public.ticket_links drop column show_starts_at;
