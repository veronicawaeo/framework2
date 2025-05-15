"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import { Link, useNavigate } from "react-router-dom"

const RegisterPage = () => {
  const [nama, setNama] = useState("")
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Prepare the payload
      const payload = {
        nama,
        email,
        password,
      }

      // Send the registration request
      const response = await fetch("http://127.0.0.1:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal")
      }

      // Save the user data to localStorage
      localStorage.setItem("user", JSON.stringify(data.data))

      // Redirect to the home page
      navigate("/home-internal")
    } catch (error: any) {
      console.error("Gagal registrasi:", error)
      setError(error.message || "Registrasi gagal. Silakan coba lagi.")
    } finally {
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
              Welcome to <br /> RoomTech
            </h1>
            <p className="mt-3">
              RoomTech memudahkan semua orang untuk memesan ruangan secara praktis, cepat, dan transparan.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="col d-flex flex-column justify-content-center px-5 py-4">
          <h2 className="fw-bold mb-3">Register</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label>Nama Lengkap</label>
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan nama Anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Alamat Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Masukkan alamat email"
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
              {loading ? "Memproses..." : "Daftar"}
            </button>

            <div className="mt-5 text-center">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-decoration-none text-primary">
                Masuk
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage