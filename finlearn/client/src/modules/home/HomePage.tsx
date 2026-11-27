import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { profileService, type Profile } from "./services/profile-service"

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  // No token → no request to make, so we start already "loaded".
  const [loading, setLoading] = useState(() => localStorage.getItem("token") !== null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      return
    }
    profileService()
      .then(setProfile)
      .catch((error) => {
        if (error?.status === 401) {
          localStorage.removeItem("token")
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-gray-400">Loading...</p>
  }

  if (!profile) {
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
      Welcome, <span data-testid="nickname">{profile.nickname}</span>
    </h1>
  )
}
