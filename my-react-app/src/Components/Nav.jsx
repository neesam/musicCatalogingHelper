import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">discover</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Current</Nav.Link>
                        <Nav.Link href="/compare">Compare</Nav.Link>
                        <Nav.Link href="/playlists">Playlists</Nav.Link>
                        <Nav.Link href="/budget">Budget</Nav.Link>
                        <Nav.Link href="/tables">Tables</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;