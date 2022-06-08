import React, { useState, useEffect } from 'react';
import { FormInput, Loader } from "semantic-ui-react"
import { storage, db } from "../firebase";
import { useParams, useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { serverTimestamp, collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';


const initialState = {
    name: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
};

const AddEditUser = () => {
    const [data, setData] = useState(initialState);
    const { name, street, number, complement, district, city } = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        id && getSingleStudent();
    }, [id])

    const getSingleStudent = async () => {
        const docRef = doc(db, "students", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            setData({ ...snapshot.data() });
        }

    }

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload pausado");
                        break;
                    case "running":
                        console.log("Upload está ativo");
                    default:
                        break;
                }
            }, (error) => {
                console.log(error)
            },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        setData((prev) => ({ ...prev, img: downloadUrl }))
                    });
                }
            );
        };

        file && uploadFile()
    }, [file])

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let errors = {};
        if (!name) {
            errors.name = "Campo obrigatório"
        }

        if (!street) {
            errors.name = "Campo obrigatório"
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = validate();
        if (Object.keys(errors).length) return setErrors(errors);
        setIsSubmit(true);
        if (!id) {
            try {
                await addDoc(collection(db, "students"), {
                    ...data,
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                await updateDoc(doc(db, "students", id), {
                    ...data,
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.log(error)
            }
        }
        navigate("/");
    };
    return (
        <div className='teste'>
            <div className="container">

                {isSubmit ? <Loader active inline="centered" size="huge" /> : (
                    <>
                        <h3>{id ? "Editar Aluno" : "Adicionar Aluno"}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Nome</label>
                            <input
                                placeholder="Insira o nome"
                                error={errors.name ? { content: errors.name } : null}
                                name="name"
                                onChange={handleChange}
                                value={name}
                                autoFocus
                                className="form-input"
                            />
                            <label>Endereço</label>
                            <input
                                placeholder="Insira a sua rua"
                                error={errors.street ? { content: errors.street } : null}
                                name="street"
                                onChange={handleChange}
                                value={street}
                                className="form-input"
                            />
                            <div className="address-complements">
                                <input
                                    placeholder="Número"
                                    error={errors.number ? { content: errors.number } : null}
                                    name="number"
                                    onChange={handleChange}
                                    value={number}
                                    className="form-input-complements"
                                />
                                <input
                                    placeholder="Complemento"
                                    error={errors.complement ? { content: errors.complement } : null}
                                    name="complement"
                                    onChange={handleChange}
                                    value={complement}
                                    className="form-input-complements"
                                />
                            </div>
                            <div className="address-complements">
                                <input
                                    placeholder="Bairro"
                                    error={errors.district ? { content: errors.district } : null}
                                    name="district"
                                    onChange={handleChange}
                                    value={district}
                                    className="form-input-complements"
                                />
                                <input
                                    placeholder="Cidade/Estado"
                                    error={errors.city ? { content: errors.city } : null}
                                    name="city"
                                    onChange={handleChange}
                                    value={city}
                                    className="form-input-complements"
                                />
                            </div>
                            <label>Foto</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <button type="submit" disabled={progress !== null && progress < 100}>Submit</button>
                        </form>
                    </>
                )}

            </div>
        </div>
    )
}

export default AddEditUser