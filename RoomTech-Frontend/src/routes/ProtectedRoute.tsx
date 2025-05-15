"use client"

import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  redirectPath?: string
  requiredUserType?: "civitas" | "umum" | null // Opsional: untuk membatasi akses berdasarkan jenis pengguna
}

const ProtectedRoute = ({ redirectPath = "/login", requiredUserType = null }: ProtectedRouteProps = {}) => {
  const { isAuthenticated, loading, userType } = useAuth()
  const location = useLocation()

  // Tampilkan loading jika masih memuat status autentikasi
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Redirect ke login jika tidak terautentikasi
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  // Jika requiredUserType ditentukan, periksa apakah pengguna memiliki tipe yang sesuai
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect ke halaman yang sesuai dengan tipe pengguna
    const redirectTo = userType === "civitas" ? "/home-internal" : "/home-eksternal"
    return <Navigate to={redirectTo} replace />
  }

  // Render child routes jika terautentikasi dan memiliki tipe yang sesuai
  return <Outlet />
}

export default ProtectedRoute