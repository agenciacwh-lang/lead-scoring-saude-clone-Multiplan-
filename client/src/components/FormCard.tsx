/**
 * FormCard – Componente de Card Padrão Reutilizável
 * Garante consistência visual em todo o formulário
 * Bordas, sombras e padding idênticos em todas as etapas
 */

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <div className={`w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
