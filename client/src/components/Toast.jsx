import { useToast } from '../context/AdminContext'

export default function Toast() {
  const { toast } = useToast()
  if (!toast) return null
  return (
    <div className={`toast ${toast.type}`} key={toast.id}>
      {toast.type === 'success' ? '✓ ' : '✕ '}{toast.message}
    </div>
  )
}
