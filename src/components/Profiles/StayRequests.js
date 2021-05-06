import React, {useState, useEffect} from 'react'
import {Card, Button, Alert,Image, Container,Col,Modal, Form} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {db} from '../../firebase'
import {Link} from 'react-router-dom'

function Payment(props) {
return (
  <Modal
    {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Set Your Preferred Payment Method
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>Account Information</h4>
      <Form>
        <Form.Group id='account-name'>
          <Form.Label>Name on Card</Form.Label>
          <Form.Control type='text' required/>
        </Form.Group>
        <Form.Group id='account-number'>
          <Form.Label>Account Number</Form.Label>
          <Form.Control type='text' required/>
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col} id='exp-date'>
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control type='text' required/>
          </Form.Group>
          <Form.Group as={Col} id='csv'>
            <Form.Label>CSV</Form.Label>
            <Form.Control type='text' required/>
          </Form.Group>
          <Form.Group as={Col} id='zip-code'>
            <Form.Label>Billing Address</Form.Label>
            <Form.Control type='text' required/>
          </Form.Group>
        </Form.Row>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.onHide}>Set Payment Mehthod</Button>
    </Modal.Footer>
  </Modal>
);
}

const StayRequests = (props) => {
  const [error, setError] = useState('')
  const {currentUser, logout, stayRequestAccept} = useAuth()
  const history = useHistory()
  const userId = currentUser.uid
  const userName = currentUser.displayName
  const userPhoto = currentUser.displayPhoto
  const [stayRequests, setStayRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = db.collectionGroup('userListings').where('subletteeId','==', userId).where('status','!=','booked')
  const [modalShow, setModalShow] = React.useState(false);


  async function handleAccept(e){
    e.preventDefault()
    //const requestResponse = e.target.value
    //const requestListingId = e.target.getAttribute('data-listId')
    const stayListingId = e.target.getAttribute('data-listing-id')
    const staySubletteeId = e.target.getAttribute('data-sublettee-id')
    const staySubletteeName = e.target.getAttribute('data-sublettee-name')
    const stayListingName = e.target.getAttribute('data-listing-name')
    const stayListingMarketStatus = e.target.getAttribute('data-listing-market-status')
    const stayHostId = e.target.getAttribute('data-host-id')
    const stayHostName = e.target.getAttribute('data-host-name')

    try{
      setLoading(true)
      await stayRequestAccept(stayListingId, staySubletteeId, staySubletteeName, stayListingName, stayListingMarketStatus, stayHostId, stayHostName)
    } catch{
      setError("Failed to perform action.")
    }
    setLoading(false)
    //console.log()
  }

  function getStayRequests(){
    setLoading(true)
    ref.onSnapshot(query => {
      const data = []
      query.forEach(doc=>{
        data.push(doc.data())
      })


      setStayRequests(data[0])
      setLoading(false)
    })
  }
  useEffect(()=>{
    getStayRequests()
  },[])



  return (
    <React.Fragment>
      {stayRequests &&
        <>
        <h3>{stayRequests.host} has accepted your stay request</h3>
        <p>You are almost one step away from finding your sublet</p>
        <Card className="shadow p-3 mb-5 bg-white rounded">
          <Card.Body>
            <div style={{'display':'flex'}}>
              <div>
                <Card.Title>{stayRequests.name}</Card.Title>
                <Button style={{'margin':'10px', 'width':'150px'}} variant='primary'> View Contract</Button>
                <Button style={{'margin':'10px', 'width':'250px'}} variant='primary'> Upload Financial Documents</Button>
                <Button variant="primary" onClick={() => setModalShow(true)}>Set Payment Method</Button>
                <Payment show={modalShow} onHide={() => setModalShow(false)}/>
                <Button
                   style={{'margin':'10px', 'width':'150px'}}
                   variant='success'
                   value='accept'
                   onClick = {handleAccept}
                   data-listing-id = {stayRequests.listingId}
                   data-sublettee-id = {userId}
                   data-sublettee-name = {userName}
                   data-sublettee-photo = {userPhoto}
                   data-listing-name = {stayRequests.name}
                   data-listing-market-status = 'booked'
                   data-host-id = {stayRequests.hostId}
                   data-host-name = {stayRequests.host}
                   >
                   Accept Contract
                 </Button>
                <Button style={{'margin':'10px', 'width':'150px'}} variant='danger'> Decline Offer</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
        </>
      }



    </React.Fragment>
  )
}

export default StayRequests
