import { Suspense } from "react"
import AdminLoginForm from "./AdminLoginForm"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-vula-cream flex items-center justify-center">
        <p className="font-sans text-vula-muted">Loading…</p>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
