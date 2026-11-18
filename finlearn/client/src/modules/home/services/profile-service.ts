import { api } from "../../../api"

export type Profile = { id: number; email: string; nickname: string }

export function profileService(signal?: AbortSignal) {
  return api<Profile>("/me", { signal })
}
