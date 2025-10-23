-- Criar tabela payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  abacate_pay_id VARCHAR(255) UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED')),
  qr_code_base64 TEXT,
  br_code TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  paid_at TIMESTAMP,
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_cpf VARCHAR(14) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_abacate_id ON payments(abacate_pay_id);

-- Modificar tabela appointments
ALTER TABLE appointments 
  ADD COLUMN payment_id UUID REFERENCES payments(id);

-- Atualizar constraint de status
ALTER TABLE appointments 
  DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE appointments 
  ADD CONSTRAINT appointments_status_check 
    CHECK (status IN ('aguardando_pagamento', 'pendente', 'confirmado', 'cancelado', 'concluido'));

-- Configurar RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy para payments (apenas admins autenticados)
CREATE POLICY "Payments são visíveis apenas para admins" 
  ON payments FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy para inserção via service role
CREATE POLICY "Payments podem ser inseridos via service role"
  ON payments FOR INSERT
  WITH CHECK (true);

-- Policy para update via service role
CREATE POLICY "Payments podem ser atualizados via service role"
  ON payments FOR UPDATE
  USING (true);

