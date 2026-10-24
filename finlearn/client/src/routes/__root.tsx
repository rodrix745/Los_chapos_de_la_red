import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
      <Outlet />
    </main>
  ),
})
