import React, {useState, useEffect} from 'react'
import {Card, Button, Alert,Image, Container,Col} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {db} from '../../firebase'
import {Link} from 'react-router-dom'
import ComingSoon from '../ComingSoon'

const ShowRequests = (props) => {
  const [error, setError] = useState('')
  const {currentUser, logout, acceptRequest} = useAuth()
  const history = useHistory()
  const userId = currentUser.uid
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = db.collectionGroup('userListings').where('hostId','==', userId)

  async function handleAccept(e){
    e.preventDefault()
    const requestResponse = e.target.value
    const requestListingId = e.target.getAttribute('data-list-id')
    const requestSubletteeId = e.target.getAttribute('data-unq-subletee-id')
    const requestIntroMessage = e.target.getAttribute('data-intro')
    const requestSubletteePhoto = e.target.getAttribute('data-sublettee-photo')
    try{
      setLoading(true)
      await acceptRequest(requestResponse, requestListingId, requestSubletteeId, requestIntroMessage, requestSubletteePhoto)
    } catch{
      setError("Failed to perform action.")
      console.log(error)
    }
    setLoading(false)
    //console.log()
  }

  function getRequests(){
    setLoading(true)
    ref.onSnapshot(query => {
      const data = []
      query.forEach(doc=>{
        data.push(doc.data().bookingRequests)
      })
      console.log(data)
      //console.log(data[0][0])
      setRequests(data)
      setLoading(false)
    })
  }
  useEffect(()=>{
    getRequests()
  },[])

  return (
    <React.Fragment>
    {requests[0] && <h3>Your Listing Requests</h3>}
    <hr></hr>
    {requests && requests.map(request =>(
      request.map(r =>(
        <Card className="shadow p-3 mb-5 bg-white rounded">
          <Card.Body>
            <div style={{'display':'flex'}}>
            <Image style={{'width':'100px','height':'100px', 'marginRight':'50px','objectFit':'cover'}} src={r.subletteePhoto} roundedCircle/>

              <div>
                <Card.Title>{r.introMessage}</Card.Title>
                <p>{r.subletteeName}</p>
                <Button
                 style={{'margin':'10px', 'width':'100px'}}
                 variant='success' onClick={handleAccept}
                 value='accept' data-list-id={r.listingId}
                 data-unq-subletee-id={r.subletteeId}
                 data-intro={r.introMessage}
                 data-sublettee-photo={r.subletteePhoto}
                 >
                  Accept
                </Button>
                <ComingSoon
                  name="Decline"
                  width = "100px"
                  height = "40px"
                  text = "This feature would allow you to decline a sublete's request."
                  />
              </div>
            </div>
          </Card.Body>
        </Card>
      ))


    ))}


    </React.Fragment>
  )
}

export default ShowRequests
