
import React, {useRef, useState} from 'react'
import {Form, Button, Card, Container, Alert, Col} from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

const PostListing = (props) => {
  const ListingRef = useRef()
  const BedRef = useRef()
  const rentRef = useRef()
  const BathRef = useRef()
  const guestRef = useRef()
  const descriptionRef = useRef()
  const addressRef = useRef()
  const furnishedRef = useRef()
  const {postListing, currentUser} = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('Empty')
  const history = useHistory()

  async function handleSubmit(e){
    e.preventDefault()
    try{
      setError('')
      setLoading(true)
      await postListing(ListingRef.current.value, addressRef.current.value, BedRef.current.value, BathRef.current.value, furnishedRef.current.value, guestRef.current.value, descriptionRef.current.value, rentRef.current.value,fileName,currentUser.photoURL)
      history.push('/profile')
    } catch{
      setError("Failed to perform action.")
      console.log(error)
    }
    setLoading(false)
  }
  function onFileChange(e){
    const file = e.target.files[0]
    setFileName(file)
    console.log(file)
  }


  return (
    <React.Fragment>
      <Container className='d-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}>
      <div className='w-100' style={{maxWidth:"600px"}}>
        <Card>
          <Card.Body>
            <h2 className='text-center mb-4'>Post Your Listing</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className='m-auto' onSubmit={handleSubmit}>
              <Form.Group id='listing-name'>
                <Form.Label>Listing Name</Form.Label>
                <Form.Control type='text' ref={ListingRef} required/>
              </Form.Group>
              <Form.Group id='rent'>
                <Form.Label>Rent Amount Per Month</Form.Label>
                <Form.Control type="number" step="0.01" ref={rentRef} required/>
              </Form.Group>
              <Form.Row>
                <Form.Group as={Col} id='bed'>
                  <Form.Label>Bed</Form.Label>
                  <Form.Control type='text' ref={BedRef} required/>
                </Form.Group>
                <Form.Group as={Col} id='bath'>
                  <Form.Label>Bath</Form.Label>
                  <Form.Control type='text' ref={BathRef} required/>
                </Form.Group>
                <Form.Group as={Col} id='furnished-type'>
                  <Form.Label>Furnished</Form.Label>
                  <Form.Control as="select" ref={furnishedRef} required>
                    <option value='furnished'>Furnished</option>
                    <option value='unfurnished'>Unfurnished</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              <Form.Group id='guests'>
                <Form.Label>Number of People</Form.Label>
                <Form.Control type='text' ref={guestRef} required/>
              </Form.Group>
              <Form.Group id='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control type='text' ref={addressRef} required/>
              </Form.Group>
              <Form.Group id='desc'>
                <Form.Label>Add a Description</Form.Label>
                <Form.Control type='text' as="textarea" rows={6} ref={descriptionRef} required/>
              </Form.Group>
              <Form.Group id='listingPhoto'>
                <Form.Label>Upload Photo</Form.Label>
                <Form.File type='file' id='profile-photo' onChange={onFileChange}/>
              </Form.Group>
              <Button className='w-100' type='submit' disabled={loading}>Save Changes</Button>
            </Form>

          </Card.Body>


        </Card>
      </div>
      </Container>

    </React.Fragment>
  )
}

export default PostListing
