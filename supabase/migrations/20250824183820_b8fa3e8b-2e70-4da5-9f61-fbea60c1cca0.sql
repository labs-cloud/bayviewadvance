-- Secure applications table: allow SELECT only for service role, keep anonymous INSERT intact
-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Add a restrictive SELECT policy for service role only
DROP POLICY IF EXISTS "Allow service role to read applications" ON public.applications;
CREATE POLICY "Allow service role to read applications"
ON public.applications
FOR SELECT
USING (auth.role() = 'service_role');
