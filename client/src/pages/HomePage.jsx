import  { useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

import Header from '../components/Header'
import OneStudentLead from './OneStudentLead'
import OneSupervisor from './OneSupervisor'
import SupervisorStudent from './SupervisorStudent'
import ViewProject from './ViewProject/ViewProjectForHomepage'

const HomePage = () => {
    let { user} = useContext(AuthContext)




    return (
        <div className="p-2 w-full mx-0 bg-white  rounded-lg">
            <Header/>
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-8">
                <button className='py-2 pr-8 text-sm sm:text-md bg-green-600 text-yellow-400 font-semibold'>
                    <Link to='/profile'>Create/Update Profile</Link>
                </button>

                {user.role === 'student' ? (<div>
                    <button className='py-2 px-4  bg-green-600 text-yellow-400 font-semibold hidden sm:block'>
                        <Link to='/create_project'>Create/Update Project</Link>
                    </button>
                </div>)
                    : 
                    (<div></div>  )
                }
                {user.role === 'student' ? (<div>
                    <button className='py-2 px-4 bg-green-600 text-yellow-400 font-semibold hidden sm:block'>
                                    <Link to='/add_member'>Add Project Members + </Link>
                    </button>
                </div>)
                    : 
                    (<div></div>  )
                }
            </div>

            <section className="mt-8">
            { user.role === "student" ? (<OneStudentLead/>) :   (<OneSupervisor/>)   }
            </section>

            <section className="mt-8">
            {user.role === 'supervisor' ? (<SupervisorStudent supervisorId={user.supervisorId} />)
            : 
            (<div></div>  )}
            </section>

            <section className="mt-8 sm:hidden block">
            {user.role === 'student' ? (<div>
                    <button className='py-2 px-4 bg-green-600 text-yellow-400 font-semibold'>
                        <Link to='/create_project'>Create/Update Project</Link>
                    </button>
            </div>)
            : 
            (<div></div>  )
                }
            </section>

            <hr className="border-t-3 my-4 border-green-500" />

            <section className="grid">
                    {user.role === 'student' ? (<ViewProject supervisorId={user.supervisorId} />)
                    : 
                    (<div></div>  )}
            </section>


        <section className="mt-8 sm:hidden block">
        {user.role === 'student' ? (<div>
                        <button className='py-2 px-4 bg-green-600 text-yellow-400 font-semibold'>
                                <Link to='/add_member'>Add Project Members + </Link>
                        </button>
          </div>)
           : 
           (<div></div>  )
        }
        </section>

        {/* {user.role === 'student' ? (<ViewMembers supervisorId={user.supervisorId} />)
         : 
         (<div></div>  )} */}
        
        </div>
        

    )
}

export default HomePage
