import React from 'react'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
    const navigate = useNavigate();
    return (
        <div className="nav-menu">
            <div className='nav-container'>
                <a href="/">Home</a>
                <button onClick={() => navigate("/add")}>
                    Adicionar Aluno
                </button>
            </div>
        </div>

    )
}

export default NavBar