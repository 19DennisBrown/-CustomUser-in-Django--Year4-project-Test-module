import  { useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

import Header from '../components/Header'
import OneStudentLead from './OneStudentLead'
import OneSupervisor from './OneSupervisor'
import SupervisorStudent from './SupervisorStudent'

const HomePage = () => {
    let { user} = useContext(AuthContext)




    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
            <Header/>
            <p className="text-lg font-semibold text-gray-700 mb-4">You are logged into the home page!</p>
            <div className="">
                <button>
                    <Link to='/profile'>Create Profile</Link>
                </button>
            </div>

       
          { user.role === "student" ? (<OneStudentLead/>) :   (<OneSupervisor/>)   }
          {user.role === 'supervisor' ? (<SupervisorStudent supervisorId={user.supervisorId} />)
           : 
           (<div>You do not have permission to view the student list.</div>  )
           }
        </div>

    )
}

export default HomePage
