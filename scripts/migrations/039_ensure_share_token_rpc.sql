-- Drop the unused ensure_share_token helper if it was created.
-- Share tokens are set from the app with a normal update on share_token.

drop function if exists public.ensure_share_token(text, uuid);
