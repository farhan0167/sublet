import React, {useState, useEffect} from 'react'
import {Nav, Navbar,Image,Dropdown,NavItem, NavLink} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../contexts/AuthContext'

const NavBar = (props) => {
  const {currentUser, logout} = useAuth()
  const [error, setError] = useState('')
  const history = useHistory()
  //<Nav.Item><Nav.Link style={{'color': '#bbb'}} href="/profile"> Profile </Nav.Link> </Nav.Item>
  async function handleLogout(){
    setError('')
    try{
      await logout()
      history.push('/')
    } catch{
      setError("Failed to log out.")
    }
  }

  if(currentUser){
    return (
      <Navbar expand='lg' style={{'backgroundColor':'#222'}}>
    		<Navbar.Brand href="/" style={{'color': 'white'}}> SubbE </Navbar.Brand>
    		<Navbar.Toggle aria-controls="basic-navbar-nav"/>
    		<Navbar.Collapse id="basic-navbar-nav">
    			<Nav className='ml-auto' style={{'color': '#bbb'}}>
    				<Nav.Item><Nav.Link style={{'color': '#bbb'}} href="/"> Home </Nav.Link> </Nav.Item>
            <Dropdown as={NavItem}>
              <Dropdown.Toggle style={{'color': 'white'}}  as={NavLink}>Profile</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                <Dropdown.Item href="/upload-dp">Update Profile Photo</Dropdown.Item>
                <Dropdown.Item href="/profile-update">Update Bio</Dropdown.Item>
                <Dropdown.Item href="/listing-add">Post Listing</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Item><Nav.Link style={{'color': '#bbb'}} onClick={handleLogout}> Logout </Nav.Link> </Nav.Item>
            <a href="/profile"><Image id='profile-img' src={currentUser.photoURL} style={{'width':'40px', 'height':'40px','objectFit':'cover', 'marginLeft':'20px'}} roundedCircle/></a>
    			</Nav>
    		</Navbar.Collapse>

    	</Navbar>
    )
  }
  else{
    return (
      <Navbar expand='lg' style={{'background-color':'#222'}}>
    		<Navbar.Brand href="/" style={{'color': 'white'}}> SubbE </Navbar.Brand>
    		<Navbar.Toggle aria-controls="basic-navbar-nav"/>
    		<Navbar.Collapse id="basic-navbar-nav">
    			<Nav className='ml-auto' style={{'color': '#bbb'}}>
    				<Nav.Item><Nav.Link style={{'color': '#bbb'}} href="/"> Home </Nav.Link> </Nav.Item>
    				<Nav.Item><Nav.Link style={{'color': '#bbb'}} href="/login"> Log In </Nav.Link> </Nav.Item>
            <Nav.Item><Nav.Link style={{'color': '#bbb'}} href="/signup"> Sign Up </Nav.Link> </Nav.Item>
    			</Nav>
    		</Navbar.Collapse>

    	</Navbar>
    )
  }
}

export default NavBar
