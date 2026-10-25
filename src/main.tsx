import { StrictMode, lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import "./index.css"

const Dashboard = lazy(() => import("@/pages/Dashboard"))

const router = createBrowserRouter([
  {
    path: "/:tab?",
    element: (
      <Suspense
        fallback={
          <div className="grid h-screen place-items-center font-mono text-sm text-muted-foreground">
            Loading…
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    ),
  },
  { path: "/dashboard", element: <Navigate to="/" replace /> },
  { path: "*", element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
