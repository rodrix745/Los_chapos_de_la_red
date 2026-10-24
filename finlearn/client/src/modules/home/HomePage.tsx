import { useEffect, useState } from "react"
import { profileService, type Profile } from "./services/profile-service"

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }
    profileService()
      .then(setProfile)
      .catch(() => {
        localStorage.removeItem("token")
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
          <a href="/login" className="rounded-md bg-emerald-600 px-4 py-2 font-semibold">
            Log in
          </a>
          <a href="/register" className="rounded-md bg-gray-800 px-4 py-2 font-semibold">
            Create account
          </a>
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
