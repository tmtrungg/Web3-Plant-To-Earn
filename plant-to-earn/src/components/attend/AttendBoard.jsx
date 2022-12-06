import React from "react"
import { useState } from "react"
import "./attendboard.css"

const AttendBoard = ({onAttend}) => {
    const [value, setValue] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        onAttend(parseInt(value))
        console.log(typeof(parseInt(value)))
    }
    return (
        <div>
            <board>
        <form className="form" onSubmit={onSubmit}>
            <div style={{fontSize: '15px'}}>
                    <input
                        className='input_name'
                        type="text"
                        placeholder = "Select team id"
                        value = {value}
                        onChange = {(e) => setValue(e.target.value)}/>
                </div>
                <div style = {{height: '100%', textAlign: 'end'}}>
                    <input className='btn btn-secondary' type="submit" value='Deposit' style={{marginRight: '0'}}/>
                </div>
            </form>
            </board>
        </div>
    )
}

export default AttendBoard;