import { createFileRoute, redirect } from "@tanstack/react-router"
import { RegisterPage } from "../modules/register/RegisterPage"
import { isAuthenticated } from "../auth"

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/" })
    }
  },
  component: RegisterPage,
})
