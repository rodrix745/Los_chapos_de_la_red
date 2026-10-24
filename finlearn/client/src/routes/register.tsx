import { createFileRoute } from "@tanstack/react-router"
import { RegisterPage } from "../modules/register/RegisterPage"

export const Route = createFileRoute("/register")({
  component: RegisterPage,
})
