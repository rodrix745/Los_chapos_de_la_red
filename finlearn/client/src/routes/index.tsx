import { createFileRoute, redirect } from "@tanstack/react-router"
import { HomePage } from "../modules/home/HomePage"
import { isAuthenticated } from "../auth"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" })
    }
  },
  component: HomePage,
})
