"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./LoginPage.css"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.add("no-body-padding")
    return () => {
      document.body.classList.remove("no-body-padding")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Kirim request ke API login
      const response = await fetch("http://127.0.0.1:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login gagal")
      }

      // Simpan data user ke localStorage
      localStorage.setItem("user", JSON.stringify(data.data))

      // Redirect ke halaman home
      navigate("/home-internal")
    } 
    catch (error: any) {
      console.error("Gagal login:", error)
      setError(error.message || "Login gagal. Silakan coba lagi.")
    } 
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="container min-vh-100 w-100 g-0 mx-0">
      <div className="row vw-100 vh-100 g-0">
        {/* Left Section */}
        <div className="col d-flex flex-column position-relative text-white bg-purple px-5 py-4">
          <Link to="/" className="position-absolute top-0 start-0 m-4">
            <img src="/images/roomtech-fix.png" alt="Logo RoomTech" style={{ width: "80px" }} />
          </Link>

          <div className="mt-auto mb-5">
            <h1 className="fw-bold">
              Selamat Datang
              <br /> di RoomTech
            </h1>
            <p className="mt-3">Login untuk mulai memesan ruangan dengan mudah dan cepat.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="col d-flex flex-column bg-light justify-content-center px-5 py-4">
          <h2 className="fw-bold mb-3">Login</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Kata Sandi</label>
              <input
                type="password"
                className="form-control"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-purple w-100" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <div className="mt-4 text-center">
              Belum punya akun?{" "}
              <Link to="/register" className="text-decoration-none text-primary">
                Daftar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage