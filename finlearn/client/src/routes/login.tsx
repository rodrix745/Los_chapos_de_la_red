import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoginPage } from "../modules/login/LoginPage"
import { isAuthenticated } from "../auth"

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/" })
    }
  },
  component: LoginPage,
})
