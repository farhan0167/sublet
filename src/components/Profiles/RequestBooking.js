import React, {useRef, useState} from 'react'
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'
import {db} from '../../firebase'


const RequestBooking = (props) => {
  const introRef = useRef()
  const {login, currentUser, bookRequest} = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e){
    e.preventDefault()
    const subletteeId = currentUser.uid
    const subletteeName = currentUser.displayName
    const subletteePhoto = currentUser.photoURL
    const listingIdvalue = window.location.search
    const listingId = listingIdvalue.substring(1)

    try{
      setError('')
      setLoading(true)

      await bookRequest(introRef.current.value, listingId, subletteeId, subletteeName, subletteePhoto)
      history.push('/')
    } catch{
      setError("Failed to perform action.")
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <React.Fragment>
      <Container className='d-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}>
      <div className='w-100' style={{maxWidth:"600px"}}>
        <Card>
          <Card.Body>
            <h2 className='text-center mb-4'>Introduce Yourself</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className='m-auto' onSubmit={handleSubmit}>
              <Form.Group id='email'>
                <Form.Label>Let the subletter know about you to start a conversation</Form.Label>
                <Form.Control type='text' as="textarea" rows={6} ref={introRef} required/>
              </Form.Group>
              <Button className='w-100' type='submit' disabled={loading}>Make Request</Button>
            </Form>

          </Card.Body>


        </Card>
      </div>
      </Container>

    </React.Fragment>
  )
}

export default RequestBooking
