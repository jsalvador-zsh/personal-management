-- RLS Policies for Services Table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view services" ON public.services;
DROP POLICY IF EXISTS "RRHH and Admin can insert services" ON public.services;
DROP POLICY IF EXISTS "RRHH and Admin can update services" ON public.services;
DROP POLICY IF EXISTS "Only Admin can delete services" ON public.services;

-- Create new policies for services table
-- SELECT: Everyone can view services
CREATE POLICY "Everyone can view services" ON public.services
  FOR SELECT
  USING (true);

-- INSERT: Only admin and rrhh users can create services
CREATE POLICY "RRHH and Admin can insert services" ON public.services
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'rrhh')
    )
  );

-- UPDATE: Only admin and rrhh users can update services
CREATE POLICY "RRHH and Admin can update services" ON public.services
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'rrhh')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'rrhh')
    )
  );

-- DELETE: Only admin users can delete services
CREATE POLICY "Only Admin can delete services" ON public.services
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
