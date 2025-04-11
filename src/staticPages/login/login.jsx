import React from 'react'
import './login.css'

function login() {
  return (
<div class="text-center ">
        <form>
            <h1 class="h3 fw-normal">Please log in</h1>

            <div class="form-floating ">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"/>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password"/>
            </div>
            <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            <p>
                Don't have an account? <a href="/signup" class="text-decoration-none ">Signup</a>
            </p>
        </form>
    </div>
  )
}

export default login