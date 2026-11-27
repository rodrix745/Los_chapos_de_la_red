import { useState, type FormEvent } from "react"
import { useNavigate, Link } from "@tanstack/react-router"
import { loginService } from "./services/login-service"
import { isApiError } from "../../api"
import { setToken } from "../../auth"

export function LoginPage() {
  const navigate = useNavigate()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setFieldErrors({})
    setFormError(null)
    setSubmitting(true)
    try {
      const { token } = await loginService({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      })
      setToken(token)
      await navigate({ to: "/" })
    } catch (error) {
      if (isApiError(error) && error.status === 400) {
        setFieldErrors(error.data.errors ?? {})
      } else if (isApiError(error)) {
        setFormError(error.data.message ?? "Something went wrong")
      } else {
        setFormError("Something went wrong")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-gray-900 p-8 shadow-xl">
      <h1 className="mb-6 text-2xl font-bold text-center">Log in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Email
          <input name="email" type="text" className="rounded-md bg-gray-800 px-3 py-2 text-white" />
          {fieldErrors.email && <span className="text-red-400 text-sm">{fieldErrors.email}</span>}
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input name="password" type="password" className="rounded-md bg-gray-800 px-3 py-2 text-white" />
          {fieldErrors.password && <span className="text-red-400 text-sm">{fieldErrors.password}</span>}
        </label>
        {formError && <span className="text-red-400 text-sm">{formError}</span>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        No account yet?{" "}
        <Link to="/register" className="text-emerald-400 underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
