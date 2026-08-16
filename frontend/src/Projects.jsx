import './Projects.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function Projects({className, setSection, setProject}){
    const projects = [
        {
            "name": "EvidenceAI",
            "color" : "rgb(217, 33, 33)",
            "Description": "RAG-powered engineering portfolio assistant that retrieves project evidence from code repositories and generates grounded, evidence-backed responses using LLMs.",
            "Skills" : [
                "Python",
                "RAG",
                "LLMs",
                "LangChain",
                "FastAPI",
                "ChromaDB",
                "OpenAI API",
                "Vector Search",
                "GitHub Actions", 
                "Google Cloud"
            ]
        },
        {
            "name": "AskMentor",
            "color": "rgb(76, 234, 18)", 
            "Description": "full-stack discussion platform that enables users to create channels, share knowledge, and collaborate through posts, replies, and direct messaging.",
            "Skills" :[
                "React",
                "Node.js",
                "Express.js",
                "MySQL",
                "Docker",
                "REST APIs"
                ]

        },
        {
            "name": "DataPredictify", 
            "color": "rgb(244, 200, 44)",
            "Description": "Machine learning web application that predicts disease outcomes using data preprocessing, model evaluation, and interactive visualizations.",
            "Skills" : [
                "Python",
                "Django",
                "Pandas",
                "NumPy",
                "Scikit-learn",
                "MatplotLib"
            ]
        }
    ]    
    return (
        <div className={className}>
            {projects.map((project) => ( 
                <div className="project_card" onClick={()=>{setSection("project"); setProject(project.name)}}>
                    <Row>
                        <Col xs="auto">
                            <div style={{backgroundColor:project.color, borderRadius:"0.5vh"}}>
                                <span class="material-symbols-outlined" 
                                        style={{color:"black", height:"2vw", margin:"0.5vh"}} >
                                    account_tree
                                </span>
                            </div>
                        </Col>
                        <Col>
                            <h6>{project.name}</h6>
                            <span style={{fontSize:"small"}}>{project.Description}</span>
                        </Col>
                    </Row>
                    <Row className="skills_row">
                        {project.Skills.map((skill) => (
                           <span className="skill_name">{skill}</span>
                        ))}
                    </Row>                   
                </div>
            ))}
        </div>
    )

}

export default Projects;