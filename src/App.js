import { useEffect } from 'react';
import './App.css';
import React, {useState} from "react";

function App(props){
    const [todoList, updatetodoList] = useState([]);
    const [activeItem, updateActiveItem] = useState({id: null, title:'', complete:false,});
    const [editing, updateEditing] = useState(false);
    var list = todoList;

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
    }

    function handleChange(event){
      let name = event.target.name
      let value = event.target.value
      console.log(name)
      console.log(value)
      updateActiveItem({id: activeItem.id, title:value, complete:activeItem.complete,})
    }
    function handleSubmit(event){
      event.preventDefault()
      console.log("ITEM", activeItem)
      let crsftoken = getCookie('crsftoken')
      let url = 'http://127.0.0.1:8000/task-create/'
      if(editing){
        url = `http://127.0.0.1:8000/task-update/${activeItem.id}/`
        updateEditing(false)
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': "application/json",
          'X-CSRFToken' : crsftoken,
        },
        body: JSON.stringify(activeItem)
      }).then((response)=> {
        fetchTasks()
        updateActiveItem({id: null, title:'', complete:false,})
      }).catch(error => console.log(error))
    }

    function fetchTasks(){
      console.log('FETCHING...')
      fetch('http://127.0.0.1:8000/task-list/')
      .then(response => response.json())
      .then(data =>
          updatetodoList(data)
        )
    }

    function startEdit(task){
      updateActiveItem(task)
      updateEditing(true)
      console.log(activeItem)
    }

    function deleteItem(task){
      let crsftoken = getCookie('crsftoken')
      fetch(`http://127.0.0.1:8000/task-delete/${task.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-type' : 'application/json',
          'X-CSRFToken' : crsftoken,
        }
      }).then((response) => {
        fetchTasks()

      })
    }
  
    useEffect(()=> {
      fetchTasks(updatetodoList)
    }, []);
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={handleSubmit}>
              <div className="flex-wrapper">
                <div style={{flex: 6}}>
                  <input onChange={handleChange} className="form-control" id="title" value={activeItem.title}placeholder="Enter A Task"></input>
                </div>
                <div syle={{flex: 1}}>
                  <input id="submit" className="btn btn-warning" type="submit" name="Add"></input>
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {list.map((task, index) => {
              return(
                <div key={index} className="task-wrapper flex-wrapper">
                  <div style={{flex: 7}}>
                    {task.complete === false ? (
                      <span>{task.title}</span>
                    ):(
                      <strike>{task.title}</strike>
                    )}
                  </div>
                  <div style={{flex: 1}}>
                    <button onClick={() => startEdit(task)}className="btn btn-sm btn-outline-info">Edit</button>
                  </div>
                  <div style={{flex: 1}}>
                  <button onClick={() => deleteItem(task)} className="btn btn-sm btn-outline-info">-</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
export default App;




