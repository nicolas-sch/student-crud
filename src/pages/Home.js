import React, { useEffect, useState } from 'react'
import { db } from "../firebase";
import { useNavigate } from "react-router-dom"
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const Home = () => {
    const [students, setStudents] = useState([]);
    const [student, setStudent] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(collection(db, "students"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() })
            });
            setStudents(list);
            setLoading(false);
        }, (error) => {
            console.log(error);
        }
        );

        return () => {
            unsub();
        }
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar o aluno?")) {
            try {
                await deleteDoc(doc(db, "students", id));
                setStudents(students.filter((student) => student.id !== id));
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <div className='home'>
            <div className="home-container">
                {students && students.map((item) => (
                    <div key={item.id}>
                        <div className="card">
                            <div className="card-image">
                                <img src={item.img}></img>
                            </div>
                            <div className="card-name">
                                <h1>{item.name}</h1>
                            </div>
                            <div className="card-address">
                                <p> {item.street}, {item.number}, {item.complement} </p>
                                <span> {item.district}, {item.city} </span>
                            </div>
                            <div className='card-buttons'>
                                <button onClick={() => navigate(`/update/${item.id}`)}>Update</button>
                                <button onClick={() => handleDelete(item.id)}>Deletar</button>
                            </div>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home