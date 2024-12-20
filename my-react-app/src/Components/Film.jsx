import render, {useEffect} from 'react'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import EntCard from '../Components/Card';

import randomColor from '../Helper/randomColor';

const Film = ({isStaticMode}) => {

    const [whichTable, setWhichTable] = useState('')
    const [film, setFilm] = useState('')
    const [filmID, setFilmID] = useState('')
    const [tablesUsed, setTablesUsed] = useState([])
    const [backgroundColor, setBackgroundColor] = useState('')

    const tables = [
        'film_ebert',
        'film_imdb250',
        'filmrecs',
        'film_towatch',
        'film_visualhypnagogia',
        'film_rymtop1500'
    ]

    useEffect(() => {
        const filmValue = localStorage.getItem('film')
        setFilm(filmValue)

        const whichTableValue = localStorage.getItem('whichFilmTable')
        setWhichTable(whichTableValue)

        const filmBackgroundColor = localStorage.getItem('filmBackgroundColor');
        setBackgroundColor(filmBackgroundColor)
    }, []);

    const getFilm = async () => {
        const fetchFilmFromWhichTable = async (whichTable) => {
            const response = await fetch(`http://localhost:5001/api/${whichTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${whichTable}`);
            }
            const data = await response.json()

            console.log(data)

            setFilm(data[0]['string_field_0'])
            setFilmID(data[0]['int64_field_1'])
            localStorage.setItem('film', data[0]['string_field_0'])

            const bgColor = randomColor()
    
            setBackgroundColor(bgColor)
            localStorage.setItem('filmBackgroundColor', bgColor)
        }

        const fetchWhichTable = async () => {

            let localTablesUsed = [...tablesUsed];

            if (localTablesUsed.length === 6) {
                localTablesUsed = []
                setTablesUsed([])
            }

            let tableUsed = false

            while (!tableUsed) {

                const response = await fetch('http://localhost:5001/api/whichFilmTable');

                if (!response.ok) {
                    throw new Error('Failed to fetch whichTable');
                }

                const data = await response.json()
                const fetchedTable = data[0]['string_field_0']

                console.log(data)

                if (!localTablesUsed.includes(fetchedTable)) {

                    tableUsed = true

                    setWhichTable(fetchedTable)

                    localTablesUsed.push(fetchedTable);
                    setTablesUsed(localTablesUsed);
                    console.log('After update:', [...tablesUsed, fetchedTable]);

                    localStorage.setItem('whichFilmTable', fetchedTable)

                    if (data.length > 0) {
                        fetchFilmFromWhichTable(fetchedTable); // Assuming data is an array and we're using the first item
                    }
                }
            }
        }

        fetchWhichTable();
    }

    // const deleteFilm = async () => {
    //     console.log(filmID)
    //     console.log(`Requesting DELETE for film ID: ${filmID}`);
    //     try {
    //         const response = await fetch(`http://localhost:5001/api/film/${filmID}/${whichTable}`, {
    //             method: 'DELETE'
    //         })

    //         const data = await response.json()
    //         console.log(data.message)
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    //     getFilm()
    // }

    const getFromSpecificTable = async (specificTable) => {
        const response = await fetch(`http://localhost:5001/api/${specificTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${specificTable}`);
            }
            const data = await response.json()

            setFilm(data[0]['string_field_0'])
            localStorage.setItem('film', data[0]['string_field_0'])

            // Logic to change background on each button press

            const bgColor = randomColor()
            setBackgroundColor(bgColor)
            localStorage.setItem('filmBackgroundColor', bgColor)
    }

    
    return (
        <EntCard 
            attributes={{ color: isStaticMode ? backgroundColor : 'pink', title: film, type: 'film', tables: tables }}
            clickFunction={getFilm}
            submitForm={getFromSpecificTable}
            // deleteFunction={deleteFilm}
         />
    )
}

export default Film