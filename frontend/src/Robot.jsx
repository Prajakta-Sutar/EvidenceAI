import Stack from "react-bootstrap/esm/Stack";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Robot.css';
import './App.css';
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRef } from "react";

function Robot({className, selectedSkill, setEvidence, conversation, setConversation, section, setSection, project}){

    const inputRef = useRef();
    const chatRef = useRef();
    const [curr_question, setQuestion] = useState("");

    const callAssistant = async (question, endpoint, message_body, fromUser) =>{
        if (fromUser){
            setSection("assistant");
            setEvidence([]);
        }
        setConversation(prev=>[...prev,  
            {
                role: "user",
                content: question
            }, 
            {
                role: "assistant",
                content: ""
            }
        
        ]);
        const response = await fetch(
            
            `https://jubilant-goggles-p747rw6796727r54-8000.app.github.dev/${endpoint}`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message_body),
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
                    setConversation(prev=>{
                        const updated=[...prev];
                        const last = updated[updated.length-1];
                        updated[updated.length-1]={
                            ...last,
                            content: updated[updated.length-1].content + output.content
                        };
                        return updated;
                    });
                }
                setQuestion("");
                if (output.type === "evidence"){
                    if (output.content.length > 0) {
                        setEvidence(output.content);
                    }
                }
            })
        }
    }

    useEffect(()=>{
        let user_question = "";
        let rest_endpoint = "";
        let message = {};

        if (section === "portfolio" || section === "project" || section === "assistant"){
            return; 
        }

        if (section === "project_evidence") {
            if (!selectedSkill || !project) {
                return;
            }
            user_question = `How ${selectedSkill} was used to build ${project}?`;
            rest_endpoint = "project_skill";
            message = {
                skill: selectedSkill,
                project: project
            };
        }

        if (section === "skill_section") {
            if (!selectedSkill){
                return;
            }
            user_question = `Experience with ${selectedSkill}`;
            rest_endpoint = "skill";
            message = {
                skill: selectedSkill
            }
        }
        callAssistant(user_question, rest_endpoint, message, false);

    },[selectedSkill,  project]);


    const handleInput = (e) =>{
        const textarea = e.target;
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    useEffect(()=>{
        if (chatRef.current){
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [conversation]);

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
            <div className="robot_figure_section">
                 <img src="./public/robot.png" className="robot_figure" />
            </div>
            <div className="assistant_panel" ref={chatRef}>
                {conversation.map((message) => (
                    <div className={message.role}>
                        <ReactMarkdown>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                ))}
            </div>
            <Form className="mt-auto text_div">
                <Form.Control 
                    ref={inputRef}
                    value={curr_question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onInput={handleInput}
                    as="textarea" 
                    className="assistant_text"
                    rows={1} 
                />
                <span class="material-symbols-outlined send_icon" 
                      onClick={()=>callAssistant(curr_question, "assistant", {question: curr_question}, true)}>
                    send
                </span>
            </Form>
        </Stack>
   )
}

export default Robot;