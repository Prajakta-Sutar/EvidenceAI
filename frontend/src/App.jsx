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
import Introduction from './Introduction';
import Evidence from './Evidence';
import ProjectDetails from './ProjectDetails';
import { useEffect, useState } from "react";


function App(){
  
  const [section, setSection] = useState("portfolio");
  const [skill, setSkill] = useState("");
  const [project, setProject] = useState("");
  const [evidence, setEvidence] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [lastSection, setLastSection] = useState("portfolio");

  useEffect(()=>{
      if(section !== "skill_section" && section !== "project_evidence" && section !== "assistant")
          setLastSection(section);
  }, [section]);

  const handleLinks = () =>{
      if (section === "skill_section"){
          setSkill("");
          setProject("");
          setEvidence([]);
          setSection("portfolio");
          setTimeout(() => {
            document.getElementById("skills")?.scrollIntoView({
              behavior: "smooth"
            });
          }, 100);
      }
      else if (section === "project_evidence"){
        setSkill("");
        setEvidence([]);
        setSection("project")
      }
      else if (section === "assistant"){
          setEvidence([]);
          setSection(lastSection);
      }
      else{
        setSkill("");
        setProject("");
        setEvidence([]);
        setSection("portfolio");
      }
      

    
  }

  return(
    <div fluid="xl" className="landing_page">
        <div className='portfolio'>
           <Nav className="nav_bar" >
                {(section === "evidence" || section === "skill_section") && (
                     <div className='go_back' 
                          onClick={()=>{handleLinks()}}>
                          <span class="material-symbols-outlined">arrow_back</span>
                          <p style={{margin:'0'}}>Back to Portfolio</p>
                     </div>
                )}
                 {(section === "assistant") && (
                     <div className='go_back' 
                          onClick={()=>{handleLinks()}}>
                          <span class="material-symbols-outlined">arrow_back</span>
                          <p style={{margin:'0'}}>Go Back</p>
                     </div>
                )}
                {(section === "project_evidence") && (
                     <div className='go_back' 
                          onClick={()=>{handleLinks()}}>
                          <span class="material-symbols-outlined">arrow_back</span>
                          <p style={{margin:'0'}}>Back to Project</p>
                     </div>
                )}
                {(section === "project") && (
                     <div className='go_back' 
                          onClick={()=>{
                            handleLinks();
                            setTimeout(() => {
                              document.getElementById("projects")?.scrollIntoView({
                                behavior: "smooth"
                              });
                            }, 100);
                          }}>
                          <span class="material-symbols-outlined">arrow_back</span>
                          <p style={{margin:'0'}}>Back to Portfolio</p>
                     </div>
                )}
                <Nav.Item className="small ms-auto" onClick={()=>handleLinks()}>
                  <Nav.Link href="#about" >About</Nav.Link>
                </Nav.Item>
                <Nav.Item className="small" onClick={()=>handleLinks()}>
                  <Nav.Link href="#skills">Skills</Nav.Link>
                </Nav.Item>
                <Nav.Item className="small" onClick={()=>handleLinks()}>
                  <Nav.Link href="#projects" >Projects</Nav.Link>
                </Nav.Item>
                <Nav.Item className="small" onClick={()=>handleLinks()}>
                  <Nav.Link href="#work" >Work Experince</Nav.Link>
                </Nav.Item>
            </Nav>
            {(section === "skill_section" || section === "project_evidence" || section === "assistant")  &&
            (<Evidence className="skill_details"  evidence={evidence} />)}
            {section === "project" && (<ProjectDetails className="project_details" setSection={setSection} project={project} setSkill={setSkill}/>)}
            {section === "portfolio" && (
            < Container className="Portfolio_section">
                <span id="about"></span>
                <Introduction className="introduction_panel" />    

                <hr className="line"/>

                <div id="skills" className=' tech_panel'>
                  <Stack direction="horizontal" gap={2} className='panel_heading'>
                        <span class="material-symbols-outlined stack_icon">stacks</span>
                        <h6 className="headings">Tech Stack</h6>   
                  </Stack>
                  <p className='suggestion'>Select a skill to see projects and evidence demonstrating my experience.</p>
                  <Skills className="tech_stack" setSection={setSection} setSkill={setSkill} setConversation={setConversation}/>
                </div>

                <hr className="line"/>

                <div id="projects" className='tech_panel'>
                    <Stack direction="horizontal" gap={2} className='panel_heading'>
                      <span class="material-symbols-outlined code_icon">code_blocks</span>
                        <h6 className="headings">Featured Projects</h6>
                    </Stack>
                    <p className='suggestion'> Explore each project to discover the technologies, solutions, and ideas behind my work.</p>
                    <Projects className="project_panel" setSection={setSection} setProject={setProject}/>
                </div>

                <hr className="line"/>

                <div id='work' className=' tech_panel'>
                  <Stack direction="horizontal" gap={2} className='panel_heading'>
                        <span class="material-symbols-outlined job_icon">enterprise</span>
                        <h6 className="headings">Professional Experience</h6>
                  </Stack>
                  <Work className="work_panel" />
                </div>
            </Container>
            )}
            <div className='floating_bar'>
                  <div className='floating_item'>
                      <span className="material-symbols-outlined floating_icon" >
                          mail
                      </span>
                      prajaktas.connect@gmail.com
                  </div>
                  <div className='floating_item'>
                      <span className="material-symbols-outlined floating_icon">
                          location_on
                      </span>
                      Canada
                  </div>
                  <div className='floating_item'>
                      <span className="material-symbols-outlined floating_icon">
                          business_center
                      </span>
                      Open to opportunities
                  </div>
              </div>
        </div>
        <Container className="robot_section">
            <Robot className="robot" 
                  selectedSkill={skill} 
                  setEvidence={setEvidence} 
                  conversation={conversation} 
                  setConversation={setConversation} 
                  section={section}
                  setSection={setSection}
                  project={project}/>
        </Container>
    </div>
  )
}

export default App
