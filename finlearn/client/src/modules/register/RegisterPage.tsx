import { useState, type FormEvent } from "react"
import { useNavigate } from "@tanstack/react-router"
import { registerService } from "./services/register-service"

export function RegisterPage() {
  const navigate = useNavigate()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setFieldErrors({})
    setSubmitting(true)
    try {
      const { token } = await registerService({
        email: String(formData.get("email") ?? ""),
        nickname: String(formData.get("nickname") ?? ""),
        password: String(formData.get("password") ?? ""),
      })
      localStorage.setItem("token", token)
      await navigate({ to: "/" })
    } catch (error: any) {
      setFieldErrors(error?.data?.errors ?? {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-gray-900 p-8 shadow-xl">
      <h1 className="mb-6 text-2xl font-bold text-center">Create account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Email
          <input name="email" type="text" className="rounded-md bg-gray-800 px-3 py-2 text-white" />
          {fieldErrors.email && <span className="text-red-400 text-sm">{fieldErrors.email}</span>}
        </label>
        <label className="flex flex-col gap-1">
          Nickname
          <input name="nickname" type="text" className="rounded-md bg-gray-800 px-3 py-2 text-white" />
          {fieldErrors.nickname && <span className="text-red-400 text-sm">{fieldErrors.nickname}</span>}
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input name="password" type="password" className="rounded-md bg-gray-800 px-3 py-2 text-white" />
          {fieldErrors.password && <span className="text-red-400 text-sm">{fieldErrors.password}</span>}
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="text-emerald-400 underline">
          Log in
        </a>
      </p>
    </div>
  )
}
