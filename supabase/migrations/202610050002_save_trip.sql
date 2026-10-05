create or replace function public.save_tbilisi_trip(p_title text, p_date date, p_notes text, p_stops text[], p_favorites text[], p_revision integer)
returns integer language plpgsql security invoker set search_path = public as $$
declare v_user uuid := auth.uid(); v_revision integer;
begin
  if v_user is null then raise exception 'Sign in required'; end if;
  if p_revision < 0 or p_revision is null or p_stops is null or p_favorites is null then raise exception 'Invalid trip'; end if;
  if cardinality(p_stops) > 6 or cardinality(p_favorites) > 6 then raise exception 'Too many places'; end if;
  if p_revision = 0 then
    insert into public.tbilisi_trips(user_id,title,trip_date,notes) values(v_user,p_title,p_date,p_notes) on conflict(user_id) do nothing returning revision into v_revision;
  else
    update public.tbilisi_trips set title=p_title, trip_date=p_date, notes=p_notes, revision=revision+1, updated_at=now() where user_id=v_user and revision=p_revision returning revision into v_revision;
  end if;
  if v_revision is null then raise exception 'Trip changed in another tab. Reload before saving.'; end if;
  delete from public.tbilisi_trip_stops where user_id=v_user;
  insert into public.tbilisi_trip_stops(user_id,place_id,position) select v_user,id,(ord-1)::integer from unnest(p_stops) with ordinality as stops(id,ord);
  delete from public.tbilisi_favorites where user_id=v_user;
  insert into public.tbilisi_favorites(user_id,place_id) select v_user,id from unnest(p_favorites) as favorites(id);
  return v_revision;
end;
$$;
revoke all on function public.save_tbilisi_trip(text,date,text,text[],text[],integer) from public, anon;
grant execute on function public.save_tbilisi_trip(text,date,text,text[],text[],integer) to authenticated;
