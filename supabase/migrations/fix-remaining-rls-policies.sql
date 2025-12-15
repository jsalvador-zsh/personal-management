-- ============================================================================
-- RLS Policies for Remaining Tables
-- ============================================================================

-- ============================================================================
-- HOMOLOGATIONS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Everyone can view homologations" ON public.homologations;
DROP POLICY IF EXISTS "RRHH and Admin can insert homologations" ON public.homologations;
DROP POLICY IF EXISTS "RRHH and Admin can update homologations" ON public.homologations;
DROP POLICY IF EXISTS "Only Admin can delete homologations" ON public.homologations;

CREATE POLICY "Everyone can view homologations" ON public.homologations
  FOR SELECT USING (true);

CREATE POLICY "RRHH and Admin can insert homologations" ON public.homologations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "RRHH and Admin can update homologations" ON public.homologations
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

CREATE POLICY "Only Admin can delete homologations" ON public.homologations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Everyone can view documents" ON public.documents;
DROP POLICY IF EXISTS "RRHH and Admin can insert documents" ON public.documents;
DROP POLICY IF EXISTS "RRHH and Admin can update documents" ON public.documents;
DROP POLICY IF EXISTS "Only Admin can delete documents" ON public.documents;

CREATE POLICY "Everyone can view documents" ON public.documents
  FOR SELECT USING (true);

CREATE POLICY "RRHH and Admin can insert documents" ON public.documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "RRHH and Admin can update documents" ON public.documents
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

CREATE POLICY "Only Admin can delete documents" ON public.documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- WORKER_SERVICES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Everyone can view worker_services" ON public.worker_services;
DROP POLICY IF EXISTS "RRHH and Admin can insert worker_services" ON public.worker_services;
DROP POLICY IF EXISTS "RRHH and Admin can update worker_services" ON public.worker_services;
DROP POLICY IF EXISTS "Only Admin can delete worker_services" ON public.worker_services;

CREATE POLICY "Everyone can view worker_services" ON public.worker_services
  FOR SELECT USING (true);

CREATE POLICY "RRHH and Admin can insert worker_services" ON public.worker_services
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "RRHH and Admin can update worker_services" ON public.worker_services
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

CREATE POLICY "Only Admin can delete worker_services" ON public.worker_services
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Only Admin can delete notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (
    user_id = auth.uid()
  );

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Only Admin can delete notifications" ON public.notifications
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
