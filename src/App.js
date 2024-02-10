import { useState, useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'

function App() { 
  const [showAddTask, setShowAddTask] = useReducer(showAddTask=>!showAddTask, false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async() =>{
      const taskFromServer = await fetchTasks();
      setTasks(taskFromServer);
    }
    getTasks();
  },[])

  //Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`)
      if(res.ok){
        const data = await res.json();
        return data.result
      }
    } catch (error) {
      console.log(error)
    }

  }


  //Add Task
  const addTask = async (task) => {
    try {
      const res = await fetch (`${process.env.REACT_APP_API_URL}/api/tasks`,{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(task),
      });
      const data = await res.json();
      setTasks([...tasks, data.result])
    } catch (error) {
        console.log(error);
    }
  }

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task)=>task._id!==id))
  }
  
  //Toggle Reminder
  const toggleReminder =  async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`,{
        method: 'PUT',
        headers:{
          'Content-type' : 'application/json'
        },
      })

      if(res.ok){
        const data = await res.json();
        setTasks(
          tasks.map(task=>task._id===id?{...task, reminder: data.result.reminder}:task)
        )
      } else {
        console.log(res)
      }
    } catch (error) {
      console.log(error);
    }
  
  }

  //router
  return (
    <Router>
      <div className="container">
        <Header onAdd={setShowAddTask} showAdd = {showAddTask}/>
        <Routes>
          <Route path='/' element={
            <>
            {showAddTask && <AddTask onAdd = {addTask} />}
            {tasks?.length>0?(<Tasks tasks = {tasks} onDelete={deleteTask} onToggle={toggleReminder} />)
            :('No Tasks To Show')}
          </>
          }/>
          <Route path = '/about' element = {<About />} />
        </Routes>
        <Footer />    
      </div>
    </Router>
  )
}

export default App;
