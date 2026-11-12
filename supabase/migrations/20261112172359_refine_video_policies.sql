-- SELECT already includes editorial preview. Separate write policies avoid
-- evaluating another permissive SELECT policy for every authenticated read.
do $$
declare item record;
begin
  for item in select * from (values
    ('revue_videos', 'Editors manage video metadata'),
    ('video_sources', 'Editors schedule sources'),
    ('youtube_video_sources', 'Editors manage YouTube links'),
    ('revue_video_selections', 'Editors manage selections'),
    ('revue_playlists', 'Editors manage playlists')
  ) as policies(table_name, policy_name)
  loop
    execute format('drop policy %I on public.%I', item.policy_name, item.table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select private.is_editor()))',
      item.policy_name || ' insert', item.table_name);
    execute format('create policy %I on public.%I for update to authenticated using ((select private.is_editor())) with check ((select private.is_editor()))',
      item.policy_name || ' update', item.table_name);
    if item.table_name <> 'video_sources' then
      execute format('create policy %I on public.%I for delete to authenticated using ((select private.is_editor()))',
        item.policy_name || ' delete', item.table_name);
    end if;
  end loop;
end;
$$;
