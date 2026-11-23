-- Archived revues with their public YouTube recordings.
-- Safe to run more than once: revues that already exist (by year) are skipped.
do $$
declare
  r record;
  v jsonb;
  revue uuid;
  video uuid;
  released timestamptz;
begin
  for r in select * from (values
    (2026, 'skal-skal-ikke', 'Skal, skal ikke', 'skal_skal_ikke.webp', '[["full","bV8POVzQ7Fo"]]'),
    (2025, 'objektivt-sett', 'Objektivt sett', 'objektivt_sett_dark_logo.webp', '[["full","w6pnAzlhoaM"]]'),
    (2024, 'best-for', 'Best før', 'best_foer_logo.webp', '[["full","gYgAegpTmyI"]]'),
    (2023, 'grevens-tid', 'Grevens tid – 23:59', 'grevens_tid_logo.webp', '[["full","GzcgzNqLaRc"]]'),
    (2022, 'svin-pa-skogen', 'Svin på skogen', 'Svin_paa_skogen_logo.webp', '[["full","EiuAtR7zPI4"]]'),
    (2021, 'marionett', 'Marionett', 'marionett.webp', '[["full","TvA-oNItlwA"]]'),
    (2020, 'satte-spor', 'Satte spor', 'satte_spor.webp', '[["full","dB0fC4VJsGI"]]'),
    (2019, 'kult', 'Kult!', 'kult.webp', '[["full","3XtropmKsrg"]]'),
    (2018, 'solidarisk', 'Solidarisk', 'solidarisk_web.webp', '[["act_1","yfLDWofs0-8"],["act_2","8b91ozp3i6Y"]]'),
    (2017, 'push-pop-baluba', 'Push Pop Baluba!', 'pushpop_small.webp', '[["act_1","8lyOg-lV1pg"],["act_2","gYTWXmaQfZk"]]')
  ) as t(year, slug, name, logo, videos)
  loop
    continue when exists (select 1 from public.revues where year = r.year);
    released := make_timestamptz(r.year, 3, 1, 12, 0, 0, 'Europe/Oslo');

    insert into public.revues (year, slug, visible_from, name_reveal_at)
      values (r.year, r.slug, released, released) returning id into revue;
    insert into public.revue_details (revue_id, name, poster_path)
      values (revue, r.name, 'images/revy_logoer/' || r.logo);

    for v in select * from jsonb_array_elements(r.videos::jsonb) loop
      insert into public.revue_videos (revue_id, title, kind, sort_order, published_at)
        values (revue,
          case v->>0 when 'full' then 'Hele forestillingen' when 'act_1' then 'Akt 1' else 'Akt 2' end,
          v->>0, case v->>0 when 'act_2' then 2 else 1 end, released)
        returning id into video;
      insert into public.video_sources (video_id, revue_id, provider, state, published_at, youtube_video_id)
        values (video, revue, 'youtube', 'ready', released, v->>1);
    end loop;

    update public.revue_details d set
      full_video_id = (select id from public.revue_videos where revue_id = revue and kind = 'full'),
      act_one_video_id = (select id from public.revue_videos where revue_id = revue and kind = 'act_1'),
      act_two_video_id = (select id from public.revue_videos where revue_id = revue and kind = 'act_2')
    where d.revue_id = revue;
  end loop;
end $$;
