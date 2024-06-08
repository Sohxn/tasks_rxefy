import React, { useEffect } from 'react'
import { useAuth } from '../backend/authcontext'
import {useState } from 'react'
import {motion} from 'framer-motion'
//weird datetimepicker i found online
import {DtPicker} from 'react-calendar-datetime-picker'
import 'react-calendar-datetime-picker/dist/style.css'
import axios from 'axios'

const Tasks = () => {
  //checking if the user is logged in 
  const {user} = useAuth()
  // if(user){
  //   console.log("User is logged in: ", user)
  // }else{
  //   console.log("still not logged in")
  // }

  //prompt initially closed
  const [promptopen, setPromptOpen] = useState(false) 
  const handlePrompt = () => {
      setPromptOpen(!promptopen)
      console.log("prompt pop up status: ", promptopen)
  }

  //task specific hooks
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  //collab is the array we need
  const [collab, setCollab] = useState([]) //share with users
  const [collaborator, setCollaborator] = useState('')
  const [tasks, setTasks] = useState([])
  // hook to track if task has been created for the page to refresh
  const [task_added, setTask_added] = useState(false)
  const [comp_id, setCompId] = useState('')
  const [editing, setEditing] = useState(false)
  const [taskedit, setTaskEdit] = useState(null)

  const addCollaborator = () => {
    if(collaborator){
      setCollab(prevCollab => [...prevCollab, collaborator])
      setCollaborator('')
    }
  }

  const [deadline, setDeadline] = useState(null)

  //to send the new task to backend
  const new_task = async () => {
      try{
        const task_title = title
        const task_desc = desc
        const task_deadline = deadline
        const task_collab_list = collab

        await axios.post('http://127.0.0.1:8080/api/new_task',{
            task_author: user.email,
            task_title: task_title,
            task_desc: task_desc,
            task_deadline: task_deadline,
            task_collabs: task_collab_list
          }
        )
        handlePrompt()
        console.log("Task posted successfully")
        setTask_added(!task_added)
        fetch_tasks()

      }catch(error){
        console.log("Could not post the task: ", error)
      }
  }

  //to fetch tasks from the backend 
  //im using a custom endpoint here to the route
  const fetch_tasks = async () => {
      try{
        const response = await axios.get(`http://127.0.0.1:8080/api/fetch_tasks/${user.email}`)
        setTasks(response.data.tasks)
      }catch(error){ 
        console.log("Could not fetch tasks: ",error)
      }
  }

  const completed = async (id) => {
    try{
      console.log(id)
      await axios.post(`http://127.0.0.1:8080/api/delete_task/${user.email}`,{
          task_id: id
      })
      fetch_tasks()
    }catch(error){
      console.log("Could not remove task")
    }
  }

  


  useEffect(() => {
    if(user){
      fetch_tasks()
    }
  },[user, task_added])

  
  // //sorting tasks according to deadline
  // const sort_tasks = async (arr) => {  
  //   return arr.map(elem => {
  //     const day= elem['deadline']['day']
  //     const month = elem['deadline']['month']
  //     const year = elem['deadline']['year']
  //     //murica format
  //     const deadline_date = new Date(year, month-1, day)
  //     return {...elem, deadline: deadline_date}
  //   }).sort((a,b) => a.deadline - b.deadline)
  // }

  // const sort_tasks = (arr) => {
  //   return arr.slice().sort((a, b) => {
  //     const deadlineA = new Date(a.deadline.year, a.deadline.month - 1, a.deadline.day);
  //     const deadlineB = new Date(b.deadline.year, b.deadline.month - 1, b.deadline.day);
  //     return deadlineA - deadlineB;
  //   })
  // }



  console.log(tasks)

  return (
  <>
    <div className='h-[200vh] w-screen p-10 grid grid-cols-1 lg:grid-cols-3 flex justify-center'>
      {/* i will render the cards only if the user has tasks in their account */}
      {tasks.length > 0
        ?
        tasks.map( task => (
        <div className='flex justify-left lg:h-[35vh] lg:w-[25vw] h-[40vh] w-[70vw] bg-white
                        rounded-[30px] mt-[15vh] m-auto
                        shadow-[0px_20px_20px_0px_#00000024]
                        grid grid-rows-6 text-left'>
            <div className='flex grid grid-cols-2'>
              <div className='m-10 h-2 w-48 bg-pink rounded-xl'></div>
              {task.author == user.email && (
              <button className='flex h-fit w-auto rounded-xl p-2 font-roboto border-2 mt-10 w-10 ml-auto mr-10 items-center text-xs'>
                ...
              </button>)}
            </div>
            <div className='p-10 font-robotocond text-4xl'>{task.title}</div>
            <div className='p-10 font-roboto text-gray'>{task.desc}</div>
            <div className='flex grid grid-cols-3 justify-left'>
              <span className='font-roboto text-pink m-10 col-span-1'>@author:</span><span className='text-gray text-left mr-auto mt-10 font-roboto'>
                {task.author == user.email? 'you': task.author}</span>
            </div>
            <div className='grid grid-cols-2'>
              <div className='flex justify-center m-10 p-2 h-10 rounded-lg bg-gray-light w-[10vw]
              font-roboto text-gray-dark'>{task.deadline.day}&nbsp;-&nbsp;{task.deadline.month}
              &nbsp;-&nbsp;{task.deadline.year}
              </div>
              <button onClick={() => completed(task._id)} className='m-10 p-2 h-10 rounded-lg bg-gray-dark w-fit ml-auto text-white font-roboto'>
                DONE
              </button>
            </div>

                      
        </div>))
        :
        <div>
        </div>
      }
        
    </div>

    {promptopen?
    <div className='flex bg-transparent absolute h-screen w-screen'>
      <motion.div 
      initial={{opacity: 0, scale: 0.5}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 0.1}}
      className='flex lg:h-[70vh] lg:w-[25vw] h-[80vh] mb-0 w-full backdrop-blur-3xl rounded-[30px] border-2
      lg:ml-auto mb-4 ml-4 mr-32 mt-auto lg:mb-24
      ease-in-out duration-500 justify-center
      grid grid-rows-4'>
        {/* create task */}
        <span className='row font-roboto text-center text-4xl h-20 mt-5'>Create New <span className='text-pink'>Task</span></span>
        <input
            className="row border-2 mt-[-2vh] rounded-xl h-20 w-auto text-center font-roboto"
            placeholder="Task Title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}/>
        <input
            className="row border-2 rounded-xl mt-[-3vh] h-40 w-auto text-center font-roboto"
            placeholder="Task Description"
            value={desc}
            onChange={(event) => {
              setDesc(event.target.value);
            }}/>
        
        
        
        <div className='flex grid grid-cols-3 gap-2'>
        <input
            className="row border-2 rounded-xl col-span-2 mt-10 h-12 w-auto text-center font-roboto"
            placeholder="collaborator"
            value={collaborator}
            onChange={(event) => {
              setCollaborator(event.target.value);
            }}/>
          <button onClick={addCollaborator} className='flex justify-center border-2 rounded-xl h-12 items-center 
                                                       bg-white font-roboto mt-10
                                                       border-black text-xl ease-in-out duration-300
                                                       hover:bg-black hover:text-pink'>share</button>
        
        </div>
        
        {/* datetime deadline input */}
        <div className='flex h-20 w-auto grid grid-rows-2'>
          <span className='row font-roboto text-left text-xl'>select deadline</span>
          <DtPicker onChange={setDeadline}/>
        </div>

        <button 
        onClick={new_task}
        className='h-[10vh] mb-8 w-auto border-2 border-black rounded-3xl
        text-2xl font-roboto text-black bg-white
        hover:bg-gray-dark hover:text-pink
        ease-in-out duration-300'>
            create
        </button>
      </motion.div>
    </div>: <div></div>}
      <span className='fixed flex mt-auto ml-auto right-28 bottom-10
      h-16 w-40 justify-center
      items-center border-none
      font-roboto text-xl'>Add New Task</span>
      <button onClick={handlePrompt}
      className='fixed flex mt-auto ml-auto right-0 bottom-0 m-10
      rounded-full h-16 w-16 justify-center
      items-center bg-black border-none
      font-roboto text-[5vh]'>
        <span className='text-white'>+</span>
     </button>
</>
  )
}

export default Tasks