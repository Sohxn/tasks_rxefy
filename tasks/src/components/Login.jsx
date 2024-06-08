import React, { useState, useEffect } from 'react'
import { useAuth } from '../backend/authcontext'
import { auth } from './firebase-config'
import {motion} from 'framer-motion'
import axios from 'axios'
import {Navigate, useNavigate} from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  //initially login page, switches to register if prompted
  const [viewLogin, setViewLogin] = useState(true)
  const ToggleViewState = () => {
    setViewLogin(!viewLogin)
  }

  //for navigation
  const navigate = useNavigate()

  //to check state im not using redux as of now
  const {user, setUser} = useAuth()

  //register, login and log out functions
  const signup = async () =>{
    try{
      const user_creds = await createUserWithEmailAndPassword(auth, email, password, username)
      const user = user_creds.user
      console.log(user)
      setUser(user)
      //sending data to the backend
      await axios.post('http://127.0.0.1:8080/api/register', {
          username: username,
          email: email,
          password: password
      })

      navigate('/') //navigate to tasks component
      console.log("User created succesfully")
    }catch(error){
      console.log("Could not create user account: ", error.message)
    }
  }

  const signin = async () => {
    try{
        const user_creds = await signInWithEmailAndPassword(auth, email, password)
        const user = user_creds.user
        setUser(user)
        navigate('/')
    }catch(error){
      console.log("Could not log in:", error.message)
    }
  }

  //will use later in this particular page
  const signout = async () => {
    try{
      await auth.signOut()
      navigate('/login')
    }catch(error){
      console.log("Could not sign out: ", error.message)
    }
  }

  if(user){
    console.log("USER IS LOGGED IN: ", user)
    return <Navigate to='/' />
  }

  return (
    <div className='flex justify-center items-center font-roboto bg-black w-screen h-screen ease-in-out duration-400'>
        <motion.div 
        initial={{x:100}}
        animate={{x:0}}
        className='h-screen w-screen lg:h-[60vh] lg:w-[20vw] bg-white                 
                        lg:rounded-[30px]
                        grid grid-rows-4
                        shadow-[0px_2px_100px_7px_#edf2f7]
                        z-10'>
                <div className='p-10'> 
                <span className="flex font-roboto text-4xl justify-center">{viewLogin ? "Sign In" : "Sign Up"}</span>
        <div className="flex justify-center mt-10">
          {viewLogin ? <input
            className="bg-white border-2 rounded-md h-10 w-[15vw] text-center font-roboto"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          /> : 
          <input
            className="bg-white border-2 rounded-md h-10 w-[15vw] text-center font-roboto"
            placeholder="Register Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
            }}
          /> 
          }
          
        </div>
        <div className="flex justify-center mt-5">
          {viewLogin ? <input
            className="bg-white rounded-md border-2 h-10 w-[15vw] text-center font-roboto"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          /> :
          <input 
            className="bg-white rounded-md border-2 h-10 w-[15vw] text-center font-roboto"
            type="password"
            value={password}
            placeholder="create password"
            onChange={(event) => {
              setPassword(event.target.value)
            }}
          />}
        </div>

        {/* conditional username field rendering */}
        {!viewLogin && 
        <div className="flex justify-center pt-2">
          <input
            className="bg-white rounded-md border-2 h-10 w-[15vw] text-center font-roboto mt-3"
            value={username}
            placeholder="create a username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </div>}

        <div className="flex justify-center grid grid-rows-2 gap-2 pt-10">
          {viewLogin ?
          <button className="font-roboto text-xl transition-all ease-in-out duration-500 border-2 border-black h-[7vh] w-[15vw] rounded-2xl hover:bg-black hover:text-pink ease-in-out duration-500" 
          onClick={signin}> Login</button>
          :
          <button className="font-roboto text-xl border-2 border-black h-[7vh] w-[15vw] rounded-2xl hover:bg-black hover:text-pink ease-in-out duration-500
                            hover:bg-gray-dark hover:text-white" 
          onClick={signup}>Register</button> 
          }
         
        </div>
        <div>
          <button className="flex font-roboto text-black text-center h-[6vh] justify-center pt-8 mb-10 hover:text-pink ease-in-out duration-500" 
          onClick={ToggleViewState}>{viewLogin ? "Don't have an account? Register" : "Already have an account? Login"}</button>
        </div>
      </div>
          
    </motion.div>
    </div>
  )
}

export default Login