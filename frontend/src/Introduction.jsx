import './Introduction.css';
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FaGithub } from "react-icons/fa";


function Introduction({className}){
    return(
        <div className={className}>
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
                    <Button 
                        className="resume-button" size='sm'
                        onClick={()=>{
                        window.open(
                            "../public/PrajaktaSutarResume.pdf", 
                            "_blank"
                        )
                        }}>
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
                    I am a <span style={{color:"rgb(147, 107, 241)", fontWeight:"bold"}}>B.Sc. Computer Science</span> graduate from the 
                    <span style={{color:"rgb(147, 107, 241)", fontWeight:"bold"}}> University of Saskatchewan</span>. 
                    I have built full-stack applications, predictive machine learning models, 
                    and AI-powered RAG systems. I also have experience in IT support, 
                    helping users troubleshoot technical issues and work with various 
                    technologies. I enjoy collaborating with teams, solving problems, 
                    exchanging ideas, and building meaningful software solutions.
                </p>
                <Stack direction='horizontal' className='feature_panel' gap={3}>
                        <div 
                            className='feature_card linkedin_card'
                            onClick={()=>{
                            window.open(
                                "https://www.linkedin.com/in/prajakta-sutar-usask/", 
                                "_blank"
                            )
                            }}>
                            <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg"
                            height='30vw' />
                        <span>Linkedin</span> 
                        </div>
                        <div 
                            className='feature_card github_card'
                            onClick={()=>{
                            window.open(
                                "https://github.com/Prajakta-Sutar", 
                                "_blank"
                            )
                            }}>
                            <FaGithub size={28} className="github-icon" />
                            GitHub
                        </div>
                        <div 
                            className='feature_card leetcode_card'
                            onClick={()=>{
                            window.open(
                                "https://leetcode.com/u/psutar-00/", 
                                "_blank"
                            )
                            }}>
                            <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/leetcode/leetcode-original.svg"
                            height="30vw" />
                            <span>LeetCode</span>
                        </div>
                </Stack>
            </div>
        </div>
    );
}

export default Introduction;