import './App.css';
import Nav from 'react-bootstrap/Nav'; 
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { FaLinkedin } from "react-icons/fa";
import { Icon } from "@iconify/react";
import Stack from 'react-bootstrap/Stack';
import { FaDownload } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Robot from "./Robot";
import Skills from "./Skills";
import Projects from "./Projects";
import Work from "./Work";
import Contact from "./Contact";


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
            <div className="intro_panel">
                  <h4 style={{fontWeight:"bold"}}>Hi, I'm</h4>
                  <h1 className="name_text">Prajakta Sutar</h1>
                  <h6 className="name_text"> AI and Full-Stack Developer</h6>
                  <p className='intro_text' style={{marginBottom:"2vw"}}> 
                    Passionate about AI, 
                    full-stack development, and solving complex engineering 
                    challenges, I strive to create applications that make a 
                    meaningful impact.
                  </p>
                  <Button className="resume-button" size='sm'>
                      <span class="material-symbols-outlined">
                        download
                      </span> 
                      Download resume
                  </Button>
            </div>
            <hr className="line"/>

            <div className="about_me_panel">
                <Stack direction="horizontal" gap={2} className='panel_heading'>
                  <span class="material-symbols-outlined person_icon">person</span>
                    <h6 className="headings">About Me</h6>
                </Stack>
                <p className="info_panel">
                    I am a Computer Science graduate from the University of Saskatchewan. 
                    I have built full-stack applications, predictive machine learning models, 
                    and AI-powered RAG systems. I also have experience in IT support, 
                    helping users troubleshoot technical issues and work with various 
                    technologies. I enjoy collaborating with teams, solving problems, 
                    exchanging ideas, and building meaningful software solutions.
                </p>
                <Stack direction='horizontal' className='feature_panel' gap={3}>
                      <div className='feature_card linkedin_card'>
                          <img 
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg"
                          height='30vw' />
                         <span>Linkedin</span> 
                      </div>
                      <div className='feature_card github_card'>
                          <FaGithub size={28} className="github-icon" />
                          GitHub
                      </div>
                      <div className='feature_card leetcode_card'>
                            <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/leetcode/leetcode-original.svg"
                            height="30vw" />
                            <span>LeetCode</span>
                      </div>
                </Stack>
            </div>
            
            <hr className="line"/>
            <div className=' tech_panel'>
               <Stack direction="horizontal" gap={2} className='panel_heading'>
                    <span class="material-symbols-outlined stack_icon">stacks</span>
                    <h6 className="headings">Tech Stack</h6>   
               </Stack>
               <p className='suggestion'>Select a skill to see projects and evidence demonstrating my experience.</p>
               <Skills className="tech_stack" />
            </div>

            <hr className="line"/>

            <div className=' tech_panel'>
                <Stack direction="horizontal" gap={2} className='panel_heading'>
                  <span class="material-symbols-outlined code_icon">code_blocks</span>
                    <h6 className="headings">Featured Projects</h6>
                </Stack>
                <p className='suggestion'> Explore each project to discover the technologies, solutions, and ideas behind my work.</p>
                <Projects className="project_panel" />
            </div>

            <hr className="line"/>
            <div className=' tech_panel'>
               <Stack direction="horizontal" gap={2} className='panel_heading'>
                    <span class="material-symbols-outlined job_icon">enterprise</span>
                    <h6 className="headings">Professional Experience</h6>
              </Stack>
              <Work className="work_panel" />
            </div>
          
            <hr className="line"/>

            <div className=' tech_panel'>
               <Stack direction="horizontal" gap={2} className='panel_heading'>
                    <span class="material-symbols-outlined phone_icon">phone_in_talk</span>
                    <h6 className="headings">Get In Touch</h6>
              </Stack>
              <p className='suggestion' >Let's connect! I'm always open to new opportunities and meaningful conversations.</p>
              <Contact className="contact_panel" />
            </div>
            <div className='floating_bar'>
                <div className='floating_item'>
                    <span className="material-symbols-outlined floating_icon" >
                        mail
                    </span>
                    prajakta.patil.dev@gmail.com
                </div>
                <div className='floating_item'>
                    <span className="material-symbols-outlined floating_icon">
                        phone
                    </span>
                    +1 (306) XXX-XXXX
                </div>
                <div className='floating_item'>
                    <span className="material-symbols-outlined floating_icon">
                        location_on
                    </span>
                    Canada
                </div>
            </div>
        </Container>
      <Container className="robot_section">
          <Robot className="robot" />
      </Container>
  

    </div>
  )
}

export default App
