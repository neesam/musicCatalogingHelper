import React, {useState, useEffect} from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";

import Album from "../Components/Album";
import Show from '../Components/Show';
import Film from "../Components/Film";
import Book from '../Components/Book';
import CustomModal from '../Components/CustomModal';

import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';


import 'bootstrap/dist/css/bootstrap.min.css';

const Current = () => {

    const [staticMode, setIsStaticMode] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        const mode = localStorage.getItem('staticMode')

        if (!mode) {
            setIsStaticMode(false)
            localStorage.setItem('mode', false)
        } else {
            setIsStaticMode(mode)
        }

    }, []);

    const toggleStaticMode = () => {
        setIsStaticMode((prevMode) => !prevMode);
        localStorage.setItem('staticMode', !staticMode)
    };

    const runPipeline = async () => {
        try {
            const res = await axios.post(`http://localhost:5001/api/pipeline/`);
            console.log(res.data); // assuming your response is the output from Python
        } catch (error) {
            console.error("Error in API call", error);
        }

        toast('ETL complete!', {
            autoClose: 2000,
            theme: "light",
            });
    };

    const handlesModalOpen = () => setShowModal(true);

    const handleModalHide = () => setShowModal(false)

    const handleModalClose = () => {
        setShowModal(false);
    }

    return (
    <>
        <button
            onClick={toggleStaticMode}
            className="change-theme-button">
                {staticMode ? 'Static colors' : 'Random colors'}
        </button>
        <button
            onClick={runPipeline}
            className="pipeline-button">
                Run pipeline
        </button>
        <button
            onClick={handlesModalOpen}
            className="finished-button">
                Finished content
        </button>
        <Album isStaticMode={staticMode}/>
        <Film isStaticMode={staticMode}/>
        <Show isStaticMode={staticMode}/>
        <Book isStaticMode={staticMode}/>
        <CustomModal
            showModal={showModal}
            handleModalHide={handleModalHide}
            handleModalClos={handleModalClose}
        ></CustomModal>
        <ToastContainer></ToastContainer>
    </>
  );
};

export default Current;