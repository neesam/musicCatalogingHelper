import React from 'react';

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";


const EntCard = ({clickFunction, deleteFunction, attributes}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '25vh',
            backgroundColor: attributes.color 
        }}>
            <Card style={{
                width: '50vw',
                margin: '50px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative' 
            }}>
                <Button
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1
                    }}
                    variant="outline-secondary"
                    onClick={handleModalOpen}>
                    &#9998; 
                </Button>

                <Card.Body>
                    <Card.Title>{attributes.title}</Card.Title>
                </Card.Body>
                <div>
                    <Button 
                        style={{marginLeft: '5%', marginRight: '5%', marginBottom: '3%'}} 
                        onClick={clickFunction}>
                        Get {attributes.type}
                    </Button>
                    <Button 
                        style={{marginRight: '5%', marginBottom: '3%'}} 
                        variant='danger'
                        onClick={deleteFunction}>
                        Delete {attributes.type}
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default EntCard;