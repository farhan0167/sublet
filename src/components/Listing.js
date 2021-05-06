import React, {useState, useEffect} from 'react'
import {Card, Button, Alert,Image, Container,Col} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {db} from '../firebase'
import {Link} from 'react-router-dom'

const Listing = (props) => {
  const [error, setError] = useState('')
  const {currentUser, logout} = useAuth()
  const history = useHistory()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = db.collectionGroup('userListings')
  const listingIdvalue = window.location.search
  const listingId = listingIdvalue.substring(1)

  function makeRequest(){
    history.push('/request-booking/?'+listingId)
  }

  function getListing(){
    setLoading(true)
    ref.onSnapshot(query => {
      const data = []
      const dataH=[]
      query.forEach(doc=>{
        var listingObj = {'id': '', 'data':[]}
        listingObj.id = doc.id
        listingObj.data = doc.data()
        data.push(listingObj)
      })
      //This is a hack to query a specific ID. This takes O(n) where n is the size of listings in the db.
      for (var i = 0; i < data.length; i++) {
        if (data[i].id==listingId) {
          dataH.push(data[i].data)
        }
      }
      console.log(dataH)
      setListings(dataH[0])
      setLoading(false)
    })
  }
  useEffect(()=>{
    getListing()
  },[])

  return (
    <React.Fragment>
    <Container style={{'marginTop':'50px'}}>
    <Col>
    <Card className="shadow p-3 mb-5 bg-white rounded">
      <Card.Body>
        <div style={{'display':'flex'}}>
          <Image style={{'width':'600px','height':'500px', 'marginRight':'50px'}} src={listings.listingPhoto}/>
          <div>
            <Card.Title style={{'fontWeight':'800','fontSize':'50px'}}>{listings.name}</Card.Title>
            <Card.Text style={{'fontWeight':'400','fontSize':'20px'}}>${listings.rent} /month</Card.Text>
            <hr></hr>
            <div style={{'display':'flex'}}>
              <p>{listings.beds} Bed | &nbsp;</p>
              <p>{listings.baths} Bath | &nbsp;</p>
              <p> 1000 sq. ft</p>
            </div>
            <hr></hr>
            <Card.Text>
              {listings.description}
            </Card.Text>
            <Button variant="outline-warning" onClick={makeRequest}>Request Booking</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
    <Card className="shadow p-3 mb-5 bg-white rounded">
      <Card.Body>
      <Card.Title>About Host</Card.Title>
      <div style={{'display':'flex'}}>
        <Image src='https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png' style={{'width':'80px', 'height':'80px','objectFit':'cover'}} roundedCircle/>
        <div style={{'marginLeft':'50px'}}>
          <Card.Text>
          {listings.host}
          </Card.Text>
        </div>
      </div>
        <Button variant="primary">Contact</Button>
      </Card.Body>
    </Card>
    </Col>
    </Container>

    </React.Fragment>
  )
}

export default Listing
