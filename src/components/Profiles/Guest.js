import React, {useState, useEffect} from 'react'
import {Card, Button, Alert,Image, Container,Col} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {db} from '../../firebase'
import {Link} from 'react-router-dom'

const Guest = (props) => {
  const [error, setError] = useState('')
  const {currentUser, logout} = useAuth()
  const history = useHistory()
  const userId = currentUser.uid
  const userName = currentUser.displayName
  const [guest, setGuest] = useState([])
  const [loading, setLoading] = useState(false)
  //const ref = db.collectionGroup('userListings').where('subletteeId','==', userId).where('status','!=','booked')
  const ref = db.collection('users').doc(userId)

{/**  async function handleAccept(e){
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
**/}

  function getGuest(){
    setLoading(true)
    ref.onSnapshot(query => {
      const bio = query.data()
      setGuest(bio)
      console.log(bio)
      setLoading(false)
    })

    //setLoading(false)
  }
  useEffect(()=>{
    getGuest()
  },[])


  if (guest.currentGuestStatus == true) {
    return (
      <React.Fragment>
          <Card className="shadow p-3 mb-5 bg-white rounded">
            <Card.Body>
              <div>
                <Card.Text style={{'fontSize':'30px','fontWeight':'700'}}>Current Guest at {guest.stayRequest[0].stayListingName}</Card.Text>
                <Card.Text style={{'fontSize':'20px','fontWeight':'500'}}>Guest: {guest.stayRequest[0].staySubletteeName}</Card.Text>
              </div>
              <div style={{'display':'flex'}}>
                <Button style={{'margin':'10px', 'width':'150px'}} variant='primary'> View Contract</Button>
              </div>
            </Card.Body>
          </Card>

      </React.Fragment>
    )
  }
  else {
    return null
  }

}

export default Guest
