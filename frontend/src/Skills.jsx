import './App.css';
import './Skills.css';
import Card from 'react-bootstrap/Card';
import { Icon } from "@iconify/react";

function Skills({className, setSection, setSkill}){
    const skills ={
        "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        "C": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
        "SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" ,
        "HTML": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
        "CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
        "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
        "LLM + RAG ": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openapi/openapi-original.svg",
        "React": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
        "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
        "Django": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg",
        "FastAPI": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
        "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
        "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
        "Linux": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
        "ChromaDB": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/datatables/datatables-original.svg",
        "Pandas": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg",
        "Scikit-learn": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg", 
        "MatplotLib": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg"
    };


    const handleSelection =(selected_skill)=>{
            setSection("skill");
            setSkill(selected_skill);
    }

    return (
        <div className={className}>
            {Object.entries(skills).map(([name, icon]) => (
                <Card className='image_card' onClick={()=>{handleSelection(name)}}>
                    <Card.Img variant="top" src={icon} className="skill_image"/>
                    <Card.Body>
                        <Card.Text>{name}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
            <Card className='image_card' onClick={()=>{handleSelection("LangChain")}}>
                <Icon icon="simple-icons:langchain"  height="2vw" />
                <Card.Body>
                    <Card.Text className='fs-6'>LangChain</Card.Text>
                </Card.Body>
            </Card>

        </div>
    )

}

export default Skills;
