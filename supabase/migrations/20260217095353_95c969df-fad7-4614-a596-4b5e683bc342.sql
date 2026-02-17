
-- Store anonymous password strength scores (no passwords stored)
CREATE TABLE public.strength_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strength_level TEXT NOT NULL CHECK (strength_level IN ('weak', 'moderate', 'strong', 'very-strong')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.strength_checks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous usage)
CREATE POLICY "Anyone can insert strength checks"
  ON public.strength_checks FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read aggregate data
CREATE POLICY "Anyone can read strength checks"
  ON public.strength_checks FOR SELECT
  USING (true);
