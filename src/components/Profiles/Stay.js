import React, {useState, useEffect} from 'react'
import {Card, Button, Alert,Image, Container,Col} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {db} from '../../firebase'
import {Link} from 'react-router-dom'
import ComingSoon from '../ComingSoon'

const Stay = (props) => {
  const [error, setError] = useState('')
  const {currentUser, logout} = useAuth()
  const history = useHistory()
  const userId = currentUser.uid
  const userName = currentUser.displayName
  const [stay, setStay] = useState([])
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

  function getStay(){
    setLoading(true)
    ref.onSnapshot(query => {
      const bio = query.data()
      setStay(bio)
      console.log(bio)
      setLoading(false)
    })

    //setLoading(false)
  }
  useEffect(()=>{
    getStay()
  },[])


  if (stay.currentStayStatus ==true) {
    return (
      <React.Fragment>
          <Card className="shadow p-3 mb-5 bg-white rounded">
            <Card.Body>
              <div>
                <Card.Text style={{'fontSize':'30px','fontWeight':'700'}}>Current Stay at {stay.stayRequest[0].stayListingName}</Card.Text>
                <h5>Host: {stay.stayRequest[0].stayHostName}</h5>
              </div>
              <div style={{'display':'flex'}}>
                <ComingSoon
                  name="View Contract"
                  width = "150px"
                  height = "40px"
                  text = "This feature would allow you to view your current contract."
                  />
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

export default Stay
