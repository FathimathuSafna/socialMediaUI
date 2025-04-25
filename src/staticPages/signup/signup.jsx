import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../store/supabaseClient'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
    } else {
      alert('Signup successful! Please check your email for confirmation.')
      navigate('/login')
    }
  }

  return (
    <div className="text-center">
      <form onSubmit={handleSignup}>
        <h1 className="h3 fw-normal">Create Account</h1>

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
        <button className="w-100 btn btn-lg btn-success mt-3" type="submit">
          Sign Up
        </button>
        <p className="mt-3">
          Already have an account? <a href="/login" className="text-decoration-none">Login</a>
        </p>
      </form>
    </div>
  )
}

export default Signup
