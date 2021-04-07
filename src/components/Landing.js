import React, {useState, useEffect} from 'react'
import {Card, Button, Alert} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import {db} from '../firebase'
import {Link} from 'react-router-dom'


const Landing = (props) => {
  const [error, setError] = useState('')
  const {currentUser, logout} = useAuth()
  const history = useHistory()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = db.collection('listings')

  function getListing(){
    setLoading(true)
    ref.onSnapshot(query => {
      const data = []
      query.forEach(doc=>{
        data.push(doc.data())
      })
      setListings(data)
      console.log(data)
      setLoading(false)
    })
  }
  useEffect(()=>{
    getListing()
  },[])

  return (
    <React.Fragment>
      <ul>
        {listings && listings.map(listing => (
          <li>
            <strong> Name: </strong>{listing.name}<br></br>
            <strong> Description: </strong>{listing.description}
          </li>
        ))}

      </ul>

    </React.Fragment>
  )
}

export default Landing
