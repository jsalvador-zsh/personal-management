-- RLS Policies for Certifications Table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view certifications" ON public.certifications;
DROP POLICY IF EXISTS "RRHH and Admin can insert certifications" ON public.certifications;
DROP POLICY IF EXISTS "RRHH and Admin can update certifications" ON public.certifications;
DROP POLICY IF EXISTS "Only Admin can delete certifications" ON public.certifications;

-- Create new policies for certifications table
-- SELECT: Everyone can view certifications
CREATE POLICY "Everyone can view certifications" ON public.certifications
  FOR SELECT
  USING (true);

-- INSERT: Only admin and rrhh users can create certifications
CREATE POLICY "RRHH and Admin can insert certifications" ON public.certifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'rrhh')
    )
  );

-- UPDATE: Only admin and rrhh users can update certifications
CREATE POLICY "RRHH and Admin can update certifications" ON public.certifications
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

-- DELETE: Only admin users can delete certifications
CREATE POLICY "Only Admin can delete certifications" ON public.certifications
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
