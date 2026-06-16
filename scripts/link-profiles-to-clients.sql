-- Manual linking when you already have clients rows (replace UUIDs).

-- Example: link auth user to an existing brand
-- update public.profiles
-- set client_id = '<clients-table-uuid>'
-- where id = '<auth-user-uuid>';

-- See all clients:
-- select id, client_name from public.clients order by client_name;

-- See profiles that still need a link:
-- select id, role, client_id from public.profiles where role = 'client' and client_id is null;
