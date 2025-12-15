-- RLS Policies for Evaluations Table
DROP POLICY IF EXISTS "Everyone can view evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "RRHH and Admin can insert evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "RRHH and Admin can update evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Only Admin can delete evaluations" ON public.evaluations;

CREATE POLICY "Everyone can view evaluations" ON public.evaluations
  FOR SELECT USING (true);

CREATE POLICY "RRHH and Admin can insert evaluations" ON public.evaluations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "RRHH and Admin can update evaluations" ON public.evaluations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'rrhh')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "Only Admin can delete evaluations" ON public.evaluations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
