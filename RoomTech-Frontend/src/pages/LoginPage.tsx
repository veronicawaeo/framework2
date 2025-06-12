"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

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
    console.log("--- DEBUG: Memulai proses login ---");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("--- DEBUG: Data mentah diterima dari backend ---", data);

      if (!response.ok) {
        console.error("--- DEBUG: Login GAGAL, respons tidak OK ---", data);
        throw new Error(data.message || "Login gagal")
      }

      console.log("--- DEBUG: Memeriksa 'data.data' ---", data.data);
      if (data.data) {
        console.log("--- DEBUG: Memeriksa 'data.data.token' ---", data.data.token);
      }

      if (data.data && data.data.token) {
        const token = data.data.token;
        const { token: removedToken, ...userData } = data.data;

        console.log("--- DEBUG: Data yang akan disimpan ke localStorage.setItem('token') ---", token);
        console.log("--- DEBUG: Data yang akan disimpan ke localStorage.setItem('user') ---", JSON.stringify(userData));
        
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);

        if (userData.user_type === 'ADMIN') {
          navigate("/admin"); 
        } else {
          navigate("/home-internal");
        }

        console.log("--- DEBUG: Penyimpanan ke localStorage selesai. Mengarahkan ke /home-internal ---");
      } else {
        console.error("--- DEBUG: Gagal, kondisi `if (data.data && data.data.token)` tidak terpenuhi. ---");
        throw new Error("Respons login tidak valid: token tidak ditemukan.");
      }

    } 
    catch (error: any) {
      console.error("--- DEBUG: Terjadi error di dalam blok catch ---", error);
      setError(error.message || "Login gagal. Silakan coba lagi.")
    } 
    finally {
      setLoading(false)
      console.log("--- DEBUG: Proses login selesai (blok finally) ---");
    }
  }

  return (
    <div className="container min-vh-100 w-100 g-0 mx-0">
      <div className="row vw-100 vh-100 g-0">
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
