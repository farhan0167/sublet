import React, {useContext, useState, useEffect} from 'react'
import {auth, db, storage} from '../firebase'


const AuthContext = React.createContext()

export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({children}){

  const [currentUser, setCurrentUser] = useState()
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
        accountType: type
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
          age: age
        })
      } else {
        console.log("No user exists")
      }
    return user
  }
  function UpdateDisplayPhoto(photoFile){
    var user = auth.currentUser;

    storage.ref('users/' + user.uid + '/profile.jpg').put(photoFile)


    console.log(user)
  }

  function postListing(name, address, beds, baths, furnished, guests, description){
    //post listing
    var user = auth.currentUser;
      if (user) {
        db.collection('listings').doc(user.uid).set({
          name: name,
          address: address,
          beds: beds,
          baths: baths,
          furnished: furnished,
          guests: guests,
          description: description
        })
      } else {
        console.log("No user exists")
      }
    return user
  }

//what is this thing doing down below? Maybe the answer lies here
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user=>{
      var imgUrl
      setCurrentUser(user)
      /***storage.ref('users/' + user.uid + '/profile.jpg').getDownloadURL().then(img =>{
        console.log(img)
        imgUrl = img
        user.updateProfile({
          photoURL: imgUrl
        })
      })**/
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
    postListing
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
