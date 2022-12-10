import { useReducer } from "react"
import styles from '../styles/Home.module.css'

const formReducer = (state, event) => {
    return {
        ...state,
        [event.target.name]: event.target.value
    }
}

export default function Form(){

    const [formData, setFormData] = useReducer(formReducer, {})

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
    }

    
    return (
        <form  onSubmit={handleSubmit}>
            <div className={styles.book}>
                <input type="text" onChange={setFormData} name="Title"  placeholder="Title" />
                <input type="text" onChange={setFormData} name="Author"  placeholder="Author" />
            </div>
            <br></br>
            <button className = {styles.btn} >Submit</button>
        </form>
    )
}