import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { api } from "../api"

type Me = { nickname: string }

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }
    api<Me>("/me")
      .then(setMe)
      .catch(() => {
        localStorage.removeItem("token")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-gray-400">Loading...</p>
  }

  if (!me) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-400">You are not logged in.</p>
        <div className="flex gap-4">
          <Link to="/login" className="rounded-md bg-emerald-600 px-4 py-2 font-semibold">
            Log in
          </Link>
          <Link to="/register" className="rounded-md bg-gray-800 px-4 py-2 font-semibold">
            Create account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <h1 className="text-2xl font-bold">
      Welcome, <span data-testid="nickname">{me.nickname}</span>
    </h1>
  )
}
