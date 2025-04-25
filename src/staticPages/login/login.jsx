import React, { useState } from 'react'
import './login.css'
import { supabase } from '../../store/supabaseClient'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert(error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="text-center">
      <form onSubmit={handleLogin}>
        <h1 className="h3 fw-normal">Please log in</h1>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-100 btn btn-lg btn-primary mt-3" type="submit">
          Sign in
        </button>
        <p className="mt-3">
          Don't have an account? <a href="/signup" className="text-decoration-none">Signup</a>
        </p>
      </form>
    </div>
  )
}

export default Login
