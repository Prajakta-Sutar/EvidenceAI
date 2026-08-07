import Stack from "react-bootstrap/esm/Stack";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Robot.css';
import './App.css';
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRef } from "react";

function Robot({className, selectedSkill, setEvidence}){
    const [summary, setSummary] = useState("");
    const inputRef = useRef();

    useEffect(()=>{
        if (!selectedSkill){
            return;
        }
        async function callAssistant() {
            setSummary("");
            const response = await fetch(
                
                "https://jubilant-goggles-p747rw6796727r54-8000.app.github.dev/skill",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    skill: selectedSkill
                }),
                }
            );
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let stream = ""
            while (true){
                const {value, done} = await reader.read();
                if (done){
                    break;
                }
                stream  += decoder.decode(value);
                const responses = stream.split("\n");
                stream = responses.pop();
                responses.forEach((res)=>{
                    if (!res){
                        return;
                    }

                    const output = JSON.parse(res);
                    if (output.type === "summary"){
                        setSummary(prev => prev + output.content);
                    }

                    if (output.type === "evidence"){
                        setEvidence(output.content);
                    }
                })

            }
            
        }
        callAssistant();
    },[selectedSkill]);


    const handleInput = (e) =>{
        const textarea = e.target;
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`;
    }


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
            
            <img src="../public/robot.jpeg" width={"80%"} />
            <div className="assistant_penel">
                <ReactMarkdown>
                    {summary}
                </ReactMarkdown>
            </div>
            <Form className="mt-auto text_div">
                <Form.Control 
                    ref={inputRef}
                    onInput={handleInput}
                    as="textarea" 
                    className="assistant_text"
                    rows={1} 
                />
                <span class="material-symbols-outlined send_icon">send</span>
            </Form>
        </Stack>
   )
}

export default Robot;