-- Tabela de Agendamentos (Appointments)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "fullName" TEXT NOT NULL,
    cpf TEXT NOT NULL,
    renach TEXT NOT NULL,
    "appointmentDate" DATE NOT NULL,
    "appointmentTime" TIME NOT NULL,
    location TEXT NOT NULL,
    contact TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    category TEXT NOT NULL,
    "examType" TEXT NOT NULL CHECK ("examType" IN ('Legislação', 'Prova de Rua')),
    "isConfirmed" BOOLEAN DEFAULT false,
    "isRequestSent" BOOLEAN DEFAULT false,
    "hasSgaCrtCall" BOOLEAN DEFAULT false,
    result TEXT CHECK (result IN ('APTO', 'INAPTO')),
    observations TEXT,
    "isFitVision" BOOLEAN DEFAULT false,
    "isFitPsychologist" BOOLEAN DEFAULT false,
    "isFitH572C" BOOLEAN DEFAULT false,
    "isFitCP02A" BOOLEAN DEFAULT false,
    "isFitLegislation" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Chamados (Tickets)
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentName" TEXT NOT NULL,
    "studentCpf" TEXT NOT NULL,
    "studentRenach" TEXT,
    type TEXT CHECK (type IN ('SGA', 'CRT', 'Outro')),
    status TEXT CHECK (status IN ('Aberto', 'Em Andamento', 'Resolvido')),
    description TEXT NOT NULL,
    observations TEXT,
    "appointmentId" UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Políticas de RLS (Row Level Security) - Habilitação básica
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for all users" ON public.appointments FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for all users" ON public.tickets FOR ALL TO anon USING (true) WITH CHECK (true);
