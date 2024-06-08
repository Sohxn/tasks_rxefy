import {React, createContext, useContext, useState, useEffect} from 'react'
import {auth} from '../components/firebase-config'
import { Navigate, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
const AuthContext = createContext()

//this will be used everywhere where auth is needed
export const useAuth = () => {
    return useContext(AuthContext)
}
//this will be used outside the router
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    // const navigate = useNavigate()


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (curr_user) => {
                setUser(curr_user)
                setLoading(false)
            }
        )

        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
        {!loading && children}
        </AuthContext.Provider>
    )
}

//for routes that can be accessed only if youre logged in 
export const ProtectedRoute = ({children}) => {
    const {user, loading} = useAuth()
    // const navigate = useNavigate()

    // //if not logged in go back to login lmao
    // useEffect(() => {
    //     if(!curr_user){
    //         navigate('/login')
    //     }
    // }, [curr_user, navigate])

    if(loading){
        return <div>...</div>
    }

    return user ? children : <Navigate to='/login'/>
}
