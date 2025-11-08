-- Enable Row Level Security and create policies for youtube_links
-- Run this in Supabase SQL Editor (or via psql with a service_role key)

-- 1) Enable RLS on the table
ALTER TABLE IF EXISTS public.youtube_links ENABLE ROW LEVEL SECURITY;

-- 2) Allow anyone (public) to SELECT only active rows (is_active = true)
CREATE POLICY "public_select_active" ON public.youtube_links
  FOR SELECT
  USING (is_active IS TRUE);

-- 3) Allow authenticated users to SELECT all rows (so admins/logged users can see inactive rows)
CREATE POLICY "authenticated_select_all" ON public.youtube_links
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 4) Allow authenticated users to INSERT rows
CREATE POLICY "authenticated_insert" ON public.youtube_links
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 5) Allow authenticated users to UPDATE rows
CREATE POLICY "authenticated_update" ON public.youtube_links
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 6) Allow authenticated users to DELETE rows
CREATE POLICY "authenticated_delete" ON public.youtube_links
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Notes / security considerations:
-- - These policies allow any authenticated user to create/update/delete youtube_links. If you want to
--   restrict write operations to a smaller set of admin users, replace the auth.uid() checks with a
--   custom JWT claim (e.g. "is_admin") or check membership in a roles table.
--   Example (if your JWT contains a claim "is_admin":
--
--   USING ((current_setting('jwt.claims.is_admin', true) = 'true'))
--   WITH CHECK ((current_setting('jwt.claims.is_admin', true) = 'true'))
--
-- - To apply admin-only write access while keeping public read for active rows, use the commented policy above
--   and remove the generic authenticated INSERT/UPDATE/DELETE policies.
--
-- How to apply:
-- 1) Open the Supabase project -> SQL Editor -> New query
-- 2) Paste the contents of this file and run it (or run via psql with a service_role key)
--
-- If you want, I can also generate the equivalent psql command using your service_role key (do NOT share the key here).
