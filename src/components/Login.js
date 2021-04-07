import React, {useRef, useState} from 'react'
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'



const Login = (props) => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const {login} = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e){
    e.preventDefault()

    try{
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push('/profile')
    } catch{
      setError("Failed to sign in. Please try again.")
    }
    setLoading(false)
  }

  return (
    <React.Fragment>
      <Container className='d-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}>
      <div className='w-100' style={{maxWidth:"400px"}}>
        <Card>
          <Card.Body>
            <h2 className='text-center mb-4'>Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className='m-auto' onSubmit={handleSubmit}>
              <Form.Group id='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' ref={emailRef} required/>
              </Form.Group>
              <Form.Group id='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' ref={passwordRef} required/>
              </Form.Group>
              <Button className='w-100' type='submit' disabled={loading}> Login</Button>
            </Form>

          </Card.Body>


        </Card>
        <div className='w-100 text-center mt-2'>
          Do not have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
      </Container>

    </React.Fragment>
  )
}

export default Login
