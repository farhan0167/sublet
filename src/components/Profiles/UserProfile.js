
import React, {useState, useEffect} from 'react'
import {Card, Button, Alert, Image,Container} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {db} from '../../firebase'
import {Link} from 'react-router-dom'
import ShowRequests from './ShowRequests'
import StayRequests from './StayRequests'
import Stay from './Stay'
import Guest from './Guest'

const UserProfile = (props) => {
  const [error, setError] = useState('')
  const {currentUser, logout} = useAuth()
  const history = useHistory()
  const userId = currentUser.uid
  const [userInfo, setUserInfo] = useState([])
  const [loading, setLoading] = useState(false)

  const ref = db.collection('users').doc(userId)
  const dataRequests = []
  const showListingRef = db.collection('userListings')
  const showListingQuery = showListingRef.where('hostId','==', userId).get().then(query =>{
    query.forEach(doc =>{
      dataRequests.push(doc.data().bookingRequests)
    })
  })//What are these lines of code? Are they serving any purpose?

  async function handleLogout(){
    setError('')
    try{
      await logout()
      history.push('/login')
    } catch{
      setError("Failed to log out.")
    }
  }
  //Implemented this myself. This is basically how you'd query stuff from Firestore and also use React Hooks
  function getUserInfo(){
    setLoading(true)
    ref.onSnapshot(query => {
      const bio = query.data()
      setUserInfo(bio)
      console.log(bio)
      setLoading(false)
    })
  }
  useEffect(()=>{
    getUserInfo()
  },[])



  return (
    <React.Fragment>
      <Container>
      <Card className="shadow p-3 mb-5 bg-white rounded" style={{'marginTop':'70px'}}>
        <Card.Body>
          <center>
          <h2 className='text-center mb-4' style={{'fontSize':'45px','fontWeight':'700','color':'#F28C0F'}}>Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Image id='profile-img' src={currentUser.photoURL} style={{'width':'171px', 'height':'180px','objectFit':'cover','marginTop':'40px'}} roundedCircle/><br></br>
          <Card.Text style={{'fontSize':'30px','fontWeight':'600','marginTop':'30px'}}>{currentUser.displayName}</Card.Text>
          <Card.Text style={{'fontSize':'18px','fontWeight':'300','marginTop':'20px'}}>{userInfo.bio}</Card.Text>
          </center>
        </Card.Body>
      </Card>
      <ShowRequests/>
      <StayRequests/>
      <Stay/>
      <Guest/>
      </Container>
    </React.Fragment>
  )
}

export default UserProfile
