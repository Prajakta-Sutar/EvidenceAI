import Stack from "react-bootstrap/esm/Stack";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Robot.css';
import './App.css';

function Robot({className}){
   return(
        <Stack className={className}>
            <Stack direction="horizontal" className="robot_nav">
                <span class="material-symbols-outlined star_icon">stars_2</span>
                <h6>AI Assistant</h6>
                <p className="ms-auto power_button">Powered by LLM + RAG</p>
            </Stack>
            <div className="robot_intro">
                Ask me anything about Prajakta's experience, skills, projects and more.
            </div>
            <img src="../public/robot.jpeg" style={{width:"100%"}}></img>
            <Form className="mt-auto text_div">
                <Form.Control 
                    as="textarea" 
                    className="assistant_text"
                    rows={1} 
                />
            </Form>
            <div className="verify_panel">
                <span className="material-symbols-outlined verify_icon">verified_user</span>
                <p className="verify_text">Answers are based on verified information from Prajakta's portfolio.</p>
            </div>
        </Stack>
   )
}

export default Robot;