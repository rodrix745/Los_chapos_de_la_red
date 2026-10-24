import { api } from "../../../api"

type RegisterInput = { email: string; nickname: string; password: string }
type RegisterResponse = { token: string }

export function registerService(input: RegisterInput, signal?: AbortSignal) {
  return api<RegisterResponse>("/register", { method: "POST", body: input, signal })
}
