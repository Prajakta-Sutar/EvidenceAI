import './ProjectDetails.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

function ProjectDetails({className, setSection, project, setSkill}){

    const [details, setDetails] = useState(null);
    useEffect(() => {
        fetch(`/${project}.json`)
            .then(response => response.json())
            .then(data => setDetails(data))
            .catch(error => console.error("Error getting project details:", error));
    }, [project]);

    if (!details) {
        return (
            <div className={className}>
                <p>Loading project...</p>
            </div>
        );
    }

    const handleSelection =(selected_skill)=>{
        setSection("project_evidence");
            setSkill(prev => ({
            name: selected_skill,
            id: prev.id + 1
        }));
    }

    return(
        <div className={className} >
            <div className='askmentor_intro'>
                <p className='project_name' style={{color:details.color}}> {details.name}</p>
                <p>{details.description}</p>
            </div>
            <div className='askmentor_details'>
                <div className='project_headings'>
                    <span className="material-symbols-outlined error_icon">error</span>
                    <p style={{margin:"0"}}>Project details</p>
                </div>
                <div className='project_table'>
                    <Row>
                        <Col xs="auto">
                            <span className="material-symbols-outlined table_icon">keyboard_command_key</span>
                        </Col>
                        <Col className='second_col'>Category</Col>
                        <Col ><p className='category'>{details.category}</p></Col>
                    </Row>
                    <Row>
                        <Col xs="auto">
                           <span className="material-symbols-outlined table_icon">files</span>
                        </Col>
                         <Col className='second_col'>Type</Col>
                        <Col><p>{details.type}</p></Col>
                    </Row>
                    <Row>
                        <Col xs="auto">
                           <span className="material-symbols-outlined table_icon">code_blocks</span>
                        </Col>
                         <Col className='second_col'>Code</Col>
                        <Col className='code_link'>
                            <p>
                                <a onClick={()=>{window.open(`${details.code}`,"_blank")}}>
                                    {details.code}
                                </a>
                            </p>
                        </Col>
                    </Row>            
                </div>
                <hr className='line'></hr>
                <div>
                    <div className='project_headings'>
                        <span className="material-symbols-outlined error_icon">bookmark_stacks</span>
                        <p style={{margin:"0"}}>Tech Stack</p>
                    </div>
                     <p className='suggestion'> Select a skill to see how it contributed to building {project}.</p>
                    <div className='project_tech'>
                        {Object.entries(details.skills).map(([name, icon]) => (
                            <Card className='stack_item'  onClick={()=>{handleSelection(name)}}>
                                <Card.Img variant="top" src={icon} className="skill_image"/>
                                <Card.Body>
                                    <Card.Text>{name}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                        {(project === "EvidenceAI") &&
                            <Card className='stack_item'  onClick={()=>{handleSelection("LangChain")}}>
                                   <Icon icon="simple-icons:langchain" className="skill_image"/>
                                <Card.Body>
                                    <Card.Text>LangChain</Card.Text>
                                </Card.Body>
                            </Card>
                        }
                    </div>
                </div>
                <hr className='line'></hr>
                <div >
                    <div className='project_headings'>
                        <span className="material-symbols-outlined error_icon">star</span>
                        <p style={{margin:"0"}}>Key Features</p>
                    </div>
                    <p className='suggestion'>Explore what you can accomplish with the {project} project.</p>
                    <div className='key_features'>
                        <ul>
                            {Object.entries(details.key_features).map(([features, description])=>(
                                <li><span style={{fontWeight:"bold"}}>{features} : </span> {description}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <hr className='line'></hr>
                <div>
                    <div className='project_headings'>
                        <span className="material-symbols-outlined error_icon">settings</span>
                        <p style={{margin:"0"}}>How it was build</p>
                    </div>
                    <p className='suggestion'>Discover the technologies and engineering choices that power {project}.</p>
                    <div className='project_tech_features'>
                        {Object.entries(details.technical_implementation).map(
                            ([category, implementations]) => (
                                <div className="implementation_category" key={category}>
                                    <p className='category_name'>{category}</p>
                                    <div className='feature_tech_list'>
                                        {Object.entries(implementations).map(
                                            ([title, value]) => (
                                                <div className="feature" key={title}>
                                                    <p># {title}</p>
                                                    <p className='feature_description'>{value.description}</p>
                                                    <div className="feature_tech_list">
                                                        {value.technologies.map((tech) => (
                                                            <span className="feature_tech">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <hr className='line'></hr>
                <div >
                    <div className='project_headings'>
                        <span className="material-symbols-outlined error_icon">flowsheet</span>
                        <p style={{margin:"0"}}>Data Flow</p>
                    </div>
                    <p className='suggestion'>Follow how data moves through {project}, from user actions to the frontend, backend, and database.</p>
                     <div className='project_flow'>
                            {Object.entries(details.data_flow).map(([stage, description])=>(
                                <div className='data_flow_timeline'>
                                    <div className="timeline-dot"></div>
                                    <div className='flow_content'>
                                        <p className='flow_heading'>{stage} :</p>
                                        <p>{description}</p>
                                    </div>
                                     <div className="timeline-dot"></div>
                                </div>
                            ))}
                        </div>
                </div>
            </div>      
        </div>
    );
}

export default ProjectDetails;