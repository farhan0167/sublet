import React, {useContext, useState, useEffect} from 'react'
import {auth, db, storage} from '../firebase'
import firebase from 'firebase/app'


const AuthContext = React.createContext()

export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({children}){

  const [currentUser, setCurrentUser] = useState()
  const [currentUserPhoto, setCurrentUserPhoto] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password, name,type){
    return auth.createUserWithEmailAndPassword(email, password).then(cred =>{
      cred.user.updateProfile({
        displayName: name,
        photoURL: 'https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg'
      });
      db.collection('users').doc(cred.user.uid).set({
        bio: "Please add a bio.",
        age: "Please add your age",
        accountType: type,
        stayRequest: [],
        currentStayStatus:false,
        currentGuestStatus: false
      })
      console.log(cred)
    })
  }
  function login(email, password){
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout(){
    return auth.signOut()
  }

  //Gets the currently signed in user.
  function updateProfileInfo(bio, age){
    var user = auth.currentUser;
      if (user) {
        db.collection('users').doc(user.uid).update({
          bio: bio,
          age: age,

          //StayRequest: []
        })
      } else {
        console.log("No user exists")
      }
    return user
  }
  function UpdateDisplayPhoto(photoFile){
    var imgUrl
    var user = auth.currentUser;
    if (user) {
      const update = storage.ref('users/' + user.uid + '/profile.jpg').put(photoFile)
    }

    console.log(user)
  }
  function getUserPhoto(){
    var user = auth.currentUser;
    if (user) {
      let set = storage.ref('users/' + user.uid + '/profile.jpg').getDownloadURL().then(img =>{
        console.log(img)
        user.updateProfile({
          photoURL: img
        })
      })
      setCurrentUserPhoto(set)
    }

  }

  function postListing(name, address, beds, baths, furnished, guests, description,rent,photoFile,subletterPhoto){
    //post listing
    var user = auth.currentUser;
      if (user) {

        var newDocRef = db.collection("userListings").doc() //restructured

        const makeListing = newDocRef.set({
          listingId: newDocRef.id,
          name: name,
          address: address,
          beds: beds,
          baths: baths,
          furnished: furnished,
          guests: guests,
          description: description,
          host: user.displayName,
          hostId: user.uid,
          bookingRequests: [],
          status: 'available', //available/booked/pending
          //guest: populate guest info? object holding user information.
          subletteeId: '', //used to query in StayRequest.js for identification
          rent: rent,
          listingPhoto: "https://cdn.styleblueprint.com/wp-content/uploads/2015/12/SB-ATL-ZookHome-9-e1538165814448.jpg",
          subletterPhoto: subletterPhoto
        })
        var newDocRef2 = db.collection("userListings").doc(newDocRef.id)
        const update = storage.ref('listings/' + newDocRef.id + '/listingPhoto.jpg').put(photoFile).then(img =>{
          storage.ref('listings/' + newDocRef.id + '/listingPhoto.jpg').getDownloadURL().then(img =>{
            console.log(img)
            newDocRef2.update({
              listingPhoto: img
            })
          })
        })

      } else {
        console.log("No user exists")
      }
    return user
  }

  function bookRequest(intro,listingId,subletteeId, subletteeName, subletteePhoto){

    const request = {
      'listingId': listingId,
      'subletteeId': subletteeId,
      'subletteeName': subletteeName,
      'subletteePhoto': subletteePhoto,
      'introMessage': intro,
      'status': 'none' //accept-decline-none
    }

    const ref = db.collection("userListings").doc(listingId).update({
      bookingRequests: firebase.firestore.FieldValue.arrayUnion(request)
    })
  }

  function acceptRequest(requestResponse, requestListingId, requestSubletteeId, requestIntroMessage, requestSubletteePhoto){
    var user = auth.currentUser;
    const request = {
      'listingId': requestListingId,
      'subletteeId': requestSubletteeId,
      'introMessage': requestIntroMessage,
      'requestSubletteePhoto': requestSubletteePhoto,
      'status': requestResponse //accept-decline-none
    }
    if(user){
      //For now when subletter accepts a request, all other requests are declined.
      const refEmpty = db.collection("userListings").doc(requestListingId).update({
        bookingRequests: []
      })
      //This turns the the status of a request to accept.
      const refAccept = db.collection("userListings").doc(requestListingId).update({
        bookingRequests: firebase.firestore.FieldValue.arrayUnion(request),
        subletteeId: requestSubletteeId, //the sublettee whose request is accepted goes here.
        status: 'pending'
      })

      //1. Generate Contract as well
    }
  }

  //Subletter to send the contract and BS to sublettee function down below:
  function stayRequestAccept(stayListingId, staySubletteeId, staySubletteeName, stayListingName, stayListingMarketStatus, stayHostId, stayHostName){
    var user = auth.currentUser;
    const stayRequest = {
      'stayListingId': stayListingId,
      'staySubletteeId': staySubletteeId,
      'staySubletteeName': staySubletteeName,
      'stayListingName': stayListingName,
      'stayListingMarketStatus': stayListingMarketStatus,
      'stayHostId': stayHostId,
      'stayHostName': stayHostName
    }
    const refListingStatus = db.collection("userListings").doc(stayListingId).update({
      status: 'booked'
    })
    const refEmpty = db.collection("userListings").doc(stayListingId).update({
      bookingRequests: []
    })

    //Sublettee's profile
    const currentStayRef = db.collection('users').doc(staySubletteeId).update({
      currentStay: stayListingName,
      stayRequest: firebase.firestore.FieldValue.arrayUnion(stayRequest),
      currentStayStatus: true
    })
    //Subletter's profile
    const currentGuestRef = db.collection('users').doc(stayHostId).update({
      currentGuest: staySubletteeName,
      stayRequest: firebase.firestore.FieldValue.arrayUnion(stayRequest),
      currentGuestStatus: true
    })

    //Create a new instance in the database storing the transaction.

  }
  function stayRequestDecline(){
    {/**
      1.

       **/}
  }

//what is this thing doing down below? Maybe the answer lies here
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user=>{
      var imgUrl
      setCurrentUser(user)
      getUserPhoto()
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateProfileInfo,
    UpdateDisplayPhoto,
    postListing,
    bookRequest,
    acceptRequest,
    stayRequestAccept
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
