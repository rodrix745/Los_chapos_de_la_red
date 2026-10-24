import { createFileRoute } from "@tanstack/react-router"
import { LoginPage } from "../modules/login/LoginPage"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})
