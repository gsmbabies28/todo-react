import Task from './Task'

const Tasks = ({tasks, onDelete, onToggle, onDragOver, onDrop, onDragStart}) => {

  return (
    <div className='task-container'>
        {tasks.map((task)=>(
        <Task key={task._id} task={task} onDelete={onDelete} onToggle={onToggle} onDragStart = {onDragStart} />))}
    </div>
  )
}

export default Tasks