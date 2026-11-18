import { api } from "../../../api"

type LoginInput = { email: string; password: string }
type LoginResponse = { token: string }

export function loginService(input: LoginInput, signal?: AbortSignal) {
  return api<LoginResponse>("/login", { method: "POST", body: input, signal })
}
