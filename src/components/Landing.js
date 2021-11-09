// eslint-disable-next-line
import React, {useState, useEffect} from 'react'
import {Card,Image, Container} from 'react-bootstrap'

import {useHistory} from 'react-router-dom'
import {db} from '../firebase'



const Landing = (props) => {


  const history = useHistory()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = db.collectionGroup('userListings').where('status','!=','booked')

  function getListing(){
    setLoading(true)
    ref.onSnapshot(query => {
      const data = []
      query.forEach(doc=>{
        var listingObj = {'id': '', 'data':[]}
        listingObj.id = doc.id
        listingObj.data = doc.data()
        data.push(listingObj)
      })
      setListings(data)
      console.log(data)
      setLoading(false)
    })
  }
  useEffect(()=>{
    getListing()
  },[])

  function listingClick(e){
    const listingId = e.currentTarget.id
    console.log(e.currentTarget.id)
    history.push('/listing/?'+listingId) //make sure you are consistent with the protocols. Does question mark appear?
  }

  return (
    <React.Fragment>
    <Image src='cover2.jpg' style={{'height':'100vh','objectFit':'cover','width':'100%'}} />
    <Container style={{'marginTop':'50px'}}>
      <h3 style={{'fontWeight':'800'}}>Sublets Near You</h3>
      <hr></hr>
      {listings && listings.map(listing => (
            <a style={{ cursor: 'pointer' }} onClick={listingClick} id={listing.id}>
            <Card className="shadow p-3 mb-5 bg-white rounded" style={{'marginTop':'20px'}}>
            <Card.Body>
              <div style={{'display':'flex'}}>
                <Image style={{'width':'200px','height':'150px', 'marginRight':'50px'}} src={listing.data.listingPhoto}/>
                <div>
                  <Card.Title style={{'fontWeight':'700','fontSize':'22px'}}>{listing.data.name}</Card.Title>
                  <Card.Text style={{'fontWeight':'200'}}>{listing.data.address}</Card.Text>
                  <Card.Text style={{'fontWeight':'500'}}>$ {listing.data.rent}/ month</Card.Text>
                  <Card.Text style={{'fontWeight':'300'}}>
                    {listing.data.description}
                  </Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </a>
        ))}
        </Container>


    </React.Fragment>
  )
}

export default Landing
