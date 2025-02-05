import  {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

import Header from '../components/Header'
import ProfileView from './ProfileView'

const HomePage = () => {
    let [students, setStudents] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        fetchPlans()
    }, [])


    let fetchPlans = async() =>{
        let response = await fetch('http://127.0.0.1:8000/user/supervisor/students/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setStudents(data)
            console.log(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
            <Header/>
            <p className="text-lg font-semibold text-gray-700 mb-4">You are logged into the home page!</p>
            <div className="">
                <button>
                    <Link to='/profile'>Create Profile</Link>
                </button>
            </div>
            <ul className="space-y-4">
                {students.map(student => (
                    <li 
                        key={student.id} 
                        className="p-4 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition"
                    >
                        {}
                    </li>
                ))}
            </ul>
            <ProfileView/>
        </div>

    )
}

export default HomePage
