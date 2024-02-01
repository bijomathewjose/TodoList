import React, { useEffect, useState } from 'react'
import uuid4 from 'uuid4'
import { styles } from '../Styles/Home'

const Home = () => {
    const [todoList, setTodoList] = useState([])
    const [currentTodo, setCurrentTodo] = useState({ data: "" })
    useEffect(() => {
        const todoList = JSON.parse(localStorage.getItem("todoList"))
        if (todoList) setTodoList(todoList)
    }, [])
    const onChange = (e) => setCurrentTodo({ ...currentTodo, data: e.target.value })

    function add() {
        if (currentTodo.data === "") return
        const newTodo = [...todoList, { data: currentTodo.data, id: uuid4(), done: false }]
        setCurrentTodo({ data: "", id: "" })
        setTodoList(newTodo)
        localStorage.setItem("todoList", JSON.stringify(newTodo))
    }
    function Update(current) {
        const findedIndex = todoList.findIndex((todo) => todo.id === current.id)
        const updatedList = [...todoList.slice(0, findedIndex), current, ...todoList.slice(findedIndex + 1)]
        setTodoList(updatedList)
        localStorage.setItem("todoList", JSON.stringify(updatedList))
    }
    function Delete(current) {
        const findedIndex = todoList.findIndex((todo) => todo.id === current.id)
        const newTodoList = [...todoList]
        newTodoList.splice(findedIndex, 1)
        setTodoList(newTodoList)
        localStorage.setItem("todoList", JSON.stringify(newTodoList))
    }

    return (
        <div>
            <h1>Todo-List</h1>
            <div style={styles.wrapper}>
                <Adder Add={add} onChange={onChange} value={currentTodo.data} />
                {todoList.map((todo, index) => (
                    <Todo
                        key={todo.id}
                        Update={Update}
                        Delete={Delete}
                        data={todo}
                    />
                ))}
            </div>
        </div>
    )
}
const Adder = ({ Add, onChange, value }) => {

    return (<div style={styles.container}>
        <input value={value}
            onChange={onChange}
            style={styles.input}
        />
        <button onClick={Add}>Add</button>
    </div >)
}
const Todo = ({ Update, Delete, data }) => {
    const [editMode, setEditMode] = useState(false)
    const [content, setContent] = useState(data)
    useEffect(() => {
        setContent(data)
    }, [data])
    function Edit() {
        setEditMode(true)
    }
    function onEdit(e) {
        setContent((data) => ({ ...data, data: e.target.value }))
    }
    function onChecked(e) {
        const done = e.target.checked
        const updatedContent = { ...content, done }
        setContent(updatedContent)
        Update(updatedContent)
    }
    function onUpdate() {
        if (content.data === "") {
            setContent((item) => ({ ...item, data: data.data }))
        }
        else Update(content)
        setEditMode(false)
    }

    function onDelete() {
        Delete(content)
    }
    return (
        <div style={styles.container}>
            {editMode ?
                <input
                    value={content?.data}
                    onChange={onEdit}
                    style={styles.input}
                /> :
                <p style={styles.p}>{data?.data}</p>
            }
            <button
                onClick={editMode ? onUpdate : Edit}>
                {editMode ? "Update" : "Edit"}
            </button>
            <button onClick={onDelete}>Delete</button>
            <label htmlFor='done' >Done</label>
            <input
                id='done'
                style={styles.checkBox}
                type="checkbox"
                defaultChecked={content?.done}
                onChange={onChecked}
            />
        </div >
    )
}
export default Home