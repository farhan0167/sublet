
import React, {useRef, useState} from 'react'
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

const UpdateDisplayPhoto = (props) => {
  const [fileName, setFileName] = useState('Empty')
  const {UpdateDisplayPhoto} = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e){
    e.preventDefault()
    try{
      setError('')
      setLoading(true)
      console.log(fileName)
      await UpdateDisplayPhoto(fileName)
      history.push('/profile')
    } catch{
      setError("Failed to perform action.")
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
            <h2 className='text-center mb-4'>Update Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className='m-auto' onSubmit={handleSubmit}>
              <Form.Group id='bio'>
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

export default UpdateDisplayPhoto
