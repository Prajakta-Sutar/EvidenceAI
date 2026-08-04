import './App.css';
import Nav from 'react-bootstrap/Nav'; 
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { FaLinkedin } from "react-icons/fa";
import { Icon } from "@iconify/react";
import Stack from 'react-bootstrap/Stack';
import { FaDownload } from "react-icons/fa";


function App(){
  return(
    <div fluid="xl" className="landing_page">
        < Container className="Portfolio_section">
            <Nav className="justify-content-end nav_bar" >
                <Nav.Item className="small">
                  <Nav.Link eventKey="link-0">About</Nav.Link>
                </Nav.Item>
                <Nav.Item className="small">
                  <Nav.Link eventKey="link-1">Skills</Nav.Link>
                </Nav.Item>
                <Nav.Item className="small">
                  <Nav.Link eventKey="link-2">Projects</Nav.Link>
                </Nav.Item>
                <Nav.Item className="small">
                  <Nav.Link eventKey="link-3">Work Experince</Nav.Link>
                </Nav.Item>
                <Nav.Item className="small">
                  <Nav.Link eventKey="link-4">Contact</Nav.Link>
                </Nav.Item>
            </Nav>
            <Nav>
                <Button className="resume-button" size='sm'> Download resume</Button>
            </Nav>
            <hr className="line"/>
            <h6 className="headings">About Me</h6>
            <hr className="line"/>
            <Stack direction="horizontal" gap={3}>
                <h6 className="headings">Tech Stack</h6>
                <Nav.Item className="ms-auto">
                  <Nav.Link eventKey="link-4" className='view_all'>View all skills </Nav.Link>
                </Nav.Item>
            </Stack>
            <hr className="line"/>
            <Stack direction="horizontal" gap={3}>
                <h6 className="headings">Featured Projects</h6>
                <Nav.Item className=" ms-auto">
                  <Nav.Link eventKey="link-4" className='view_all'>View all projects</Nav.Link>
                </Nav.Item>
            </Stack>
            <hr className="line"/>
            <h6 className="headings">Professional Experience</h6>
            <hr className="line"/>
            <h6 className="headings">Get In Touch</h6>
           
        </Container>
      <Container className="robot_section">

      </Container>
  

    </div>
  )
}

export default App
