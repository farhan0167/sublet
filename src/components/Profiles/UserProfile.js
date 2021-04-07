
import React, {useState, useEffect} from 'react'
import {Card, Button, Alert, Image} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {db} from '../../firebase'
import {Link} from 'react-router-dom'


const UserProfile = (props) => {
  const [error, setError] = useState('')
  const {currentUser, logout} = useAuth()
  const history = useHistory()
  const test = currentUser.uid
  const [userInfo, setUserInfo] = useState([])
  const [loading, setLoading] = useState(false)

  const ref = db.collection('users').doc(test)

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
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Image id='profile-img' src={currentUser.photoURL} style={{'width':'171px', 'height':'180px','objectFit':'cover'}} roundedCircle/><br></br>
          <strong> Email:</strong>{currentUser.email} <br></br>
          <strong> Name: </strong>{currentUser.displayName}<br></br>
          <strong> Biography: </strong>{userInfo.bio}<br></br>
          <strong> Age: </strong>{userInfo.age}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>Log Out</Button>
        <Button variant="link" ><Link to="/profile-update">Update</Link></Button>
        <Button variant="link" ><Link to="/listing-add">Add Your Listing</Link></Button>
        <Button variant="link" ><Link to="/upload-dp">Upload Profile Photo</Link></Button>
      </div>

    </React.Fragment>
  )
}

export default UserProfile
