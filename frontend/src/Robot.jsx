import Stack from "react-bootstrap/esm/Stack";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Robot.css';
import './App.css';
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRef } from "react";

function Robot({className, selectedSkill, setEvidence, 
                conversation, setConversation, section, 
                setSection, project, lastSection, questionFrom}){

    const inputRef = useRef();
    const chatRef = useRef();
    const isEvidenceStatementShown = useRef(false);
    const [curr_question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInput = (e) =>{
        const textarea = e.target;
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    const handleKeyDown =(e)=>{
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const query = curr_question.trim();
            if(!query){
                return;
            }
            setQuestion("");
            callAssistant(query, "assistant", {question: query}, true);

        }
    }

    const callAssistant = async (question, endpoint, message_body, fromUser) =>{
        isEvidenceStatementShown.current = false;
        setIsLoading(true);
        if (fromUser){
            setSection(lastSection);
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
        setIsLoading(false);
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
                if (output.type === "evidence_arriving"){
                    if(output.content == "yes"){
                        setConversation(prevConversation => [
                            ...prevConversation,
                            {
                                role: "evidence",
                                content: "Available evidence is loading ....",
                                id: "loading_evidence"
                            }
                        ]);
                    }
                }
                if (output.type === "evidence"){
                    if (Array.isArray(output.content) && output.content.length === 0){
                        return;
                    }
                    if (selectedSkill.name.toLowerCase() === "c" || selectedSkill.name.toLowerCase() === "git"){
                        return;
                    }
                    
                    setSection("assistant");
                    setIsLoading(false);
                    setConversation(prevConversation => {
                            if (prevConversation.length === 0) {
                                    return prevConversation;
                            }
                            const updated = [...prevConversation];
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                content: "Available evidence is displayed in the left panel"
                            };
                            return updated;
                        });
                    setEvidence(prev=>{                
                        const prevIndex = prev.findIndex(item=> item.file === output.content.file);
                        if (prevIndex !== -1){
                            const updated=[...prev];
                            updated[prevIndex]={
                                ...updated[prevIndex],
                                description: updated[prevIndex].description + "\n"+ output.content.description
                            };
                            return updated;
                        }
                        else{
                            return [...prev, output.content]
                        }
                    });
                }
            })
        }
    }

    useEffect(()=>{
        let user_question = "";
        let rest_endpoint = "";
        let message = {};

        if (questionFrom === "project_page") {
            if (!selectedSkill.name || !project) {
                return;
            }
            user_question = `How ${selectedSkill.name} was used to build ${project}?`;
            rest_endpoint = "project_skill";
            message = {
                skill: selectedSkill.name,
                project: project
            };
            callAssistant(user_question, rest_endpoint, message, false);
        }

        if (questionFrom === "tech_stack") {
            if (!selectedSkill.name){
                return;
            }
             if (selectedSkill.name.toLowerCase() === "c" || selectedSkill.name.toLowerCase() === "git"){
                user_question = `Experience with ${selectedSkill.name}`;
                rest_endpoint = "skill";
                message = {
                    skill: selectedSkill.name
                };
                callAssistant(user_question, rest_endpoint, message, false);
            }
            else{
                user_question = `Experience with ${selectedSkill.name}`;
                rest_endpoint = "skill";
                message = {
                    skill: selectedSkill.name
                }
                callAssistant(user_question, rest_endpoint, message, false);
            }}
            
    },[selectedSkill.name, selectedSkill.id]);

    useEffect(()=>{
        if (chatRef.current){
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [conversation]);

   return(
        <Stack className={className}>
            <div className="robot_figure_section">
                <Stack direction="horizontal" className="robot_nav">
                <span class="material-symbols-outlined star_icon">stars_2</span>
                <h6>AI Assistant</h6>
                <p className="ms-auto power_button">Powered by LLM + RAG</p>
                </Stack>
                <div className="robot_intro">
                    Ask me anything about Prajakta's experience, skills, projects and more.
                </div>
                <div className="robot_moving_section">
                    <img src="/robot.png" className="robot_figure" />
                </div>
            </div>
            <div className="assistant_panel" ref={chatRef}>
                {conversation.map((message) => (
                    <div className={message.role}>
                        {
                        (message.role === "assistant" && message.content === "" && isLoading)?
                                <div className="dot_section">
                                <span className="first_dot"></span>
                                <span className="second_dot"></span>
                                <span className="third_dot"></span>
                            </div>
                    
                        : <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h5>{children}</h5>,
                                h2: ({ children }) => <h6>{children}</h6>,
                                h3: ({ children }) => <strong>{children}</strong>,
                            }}>
                            {message.content}
                        </ReactMarkdown>
                        }
                    </div>
                ))}
            </div>
            <Form className="mt-auto text_div">
                <Form.Control 
                    ref={inputRef}
                    value={curr_question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    as="textarea" 
                    className="assistant_text"
                    rows={1} 
                />
                <span class="material-symbols-outlined send_icon" 
                      onClick={()=>{
                        const query = curr_question;
                        setQuestion("");
                        callAssistant(query, "assistant", {question: query}, true)
                    
                    }}>
                    send
                </span>
            </Form>
        </Stack>
   )
}

export default Robot;