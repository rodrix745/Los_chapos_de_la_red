import { useEffect, useState } from "react"
import { profileService, type Profile } from "./services/profile-service"

// The route guard guarantees the token exists here; a rejected 401 is
// handled centrally by api.ts.
export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profileService()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-gray-400">Loading...</p>
  }

  if (!profile) {
    return <p className="text-gray-400">Could not load your profile.</p>
  }

  return (
    <h1 className="text-2xl font-bold">
      Welcome, <span data-testid="nickname">{profile.nickname}</span>
    </h1>
  )
}
