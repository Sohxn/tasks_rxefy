import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../backend/authcontext'
import { signOut } from 'firebase/auth'
import {auth} from './firebase-config'
import {motion} from 'framer-motion'

const Navbar = () => {
  const {user} = useAuth()
  const navigate = useNavigate()

  const logout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
  <>
    <div className='fixed flex h-[12vh] bg-black w-screen items-center'>
      <motion.div 
      initial={{x:-100}}
      animate={{x:0}}
      className='left-0'>
        <span className='font-roboto text-3xl text-white ml-10'>tasks.<span 
        
        className='text-pink'>rxefy</span></span>
      </motion.div>
      {user?
      <button
      onClick={logout}
      className='fixed text-white font-roboto flex mt-auto ml-auto right-[25vw]
                        border-2 rounded-[15px] p-2
                        lg:right-[7vw]
                        hover:bg-white hover:text-black
                        ease-in-out duration-300
                        text-xl'>
                        logout
                        </button>:
      <button 
      
      className='fixed text-white font-roboto flex mt-auto ml-auto right-[25vw]
      border-2 rounded-[15px] p-2
      lg:right-[7vw]
      hover:bg-white hover:text-black
      ease-in-out duration-300
      text-xl'>
        <Link to='/login'>
          sign in
        </Link>
      </button>}

                      
      <div className='mr-10 ml-auto'>
      
      <button className="rounded-full h-12 w-12 border-2 
                        border-pink ease-in-out 
                        duration-500 text-black text-2xl 
                        justify-center items-center flex
                        font-roboto bg-white">
      
      {user? user.email[0] : '-'}
      </button>

      
              
      </div>
    </div>
    
    
  </>  
  )
}

export default Navbar