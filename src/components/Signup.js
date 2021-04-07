import React, {useRef, useState} from 'react'
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'


const SignUp = (props) => {
  const nameRef = useRef() //channge made here
  const emailRef = useRef()
  const accountTypeRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const {signup} = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e){
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError('passwords do not match')
    }
    try{
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value, nameRef.current.value, accountTypeRef.current.value) //change was made here
      //Upon selecting the kind of user, users can get specific access to their own profiles.
      if(accountTypeRef.current.value =='subletter'){
        history.push('/profile')
      }
      else{
        history.push('/profile')
      }
    } catch{
      setError("Failed to create an account. Please try again.")
    }
    setLoading(false)
  }

  return (
    <React.Fragment>
      <Container className='d-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}>
      <div className='w-100' style={{maxWidth:"400px"}}>
        <Card>
          <Card.Body>
            <h2 className='text-center mb-4'>Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className='m-auto' onSubmit={handleSubmit}>
              <Form.Group id='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' ref={nameRef} required/>
              </Form.Group>
              <Form.Group id='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' ref={emailRef} required/>
              </Form.Group>
              <Form.Group id='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' ref={passwordRef} required/>
              </Form.Group>
              <Form.Group id='password-confirm'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='password' ref={passwordConfirmRef} required/>
              </Form.Group>
              <Form.Group id='account-type'>
                <Form.Label>Account Type</Form.Label>
                <Form.Control as="select" ref={accountTypeRef} required>
                  <option value='sublettee'>I am Subletting</option>
                  <option value='subletter'>I have a Room to Sublet</option>
                  <option value='landloard'>I am a Landloard</option>
                  <option value='sublettee-subletter'>I am both a Subletter and Sublettee</option>
                </Form.Control>
              </Form.Group>
              <Button className='w-100' type='submit' disabled={loading}> Sign Up</Button>
            </Form>

          </Card.Body>


        </Card>
        <div className='w-100 text-center mt-2'>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
      </Container>

    </React.Fragment>
  )
}

export default SignUp
