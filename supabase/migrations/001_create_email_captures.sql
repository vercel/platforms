-- Create email_captures table for storing email sign-ups
CREATE TABLE IF NOT EXISTS email_captures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  source VARCHAR(100) DEFAULT 'unknown',
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR(45),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);
CREATE INDEX IF NOT EXISTS idx_email_captures_source ON email_captures(source);
CREATE INDEX IF NOT EXISTS idx_email_captures_captured_at ON email_captures(captured_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the edge function)
CREATE POLICY "Allow anonymous email capture" ON email_captures
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Allow service role to read all emails
CREATE POLICY "Allow service role full access" ON email_captures
  FOR ALL 
  TO service_role 
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_email_captures_updated_at 
  BEFORE UPDATE ON email_captures 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();