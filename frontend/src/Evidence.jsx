import './Evidence.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


function Evidence({className, evidence}){
    const getProject=(path)=>{
        if (path.includes("askmentor")) {
            return "AskMentor";
        }
        else if (path.includes("datagenesys")) {
            return "DataPredictify";
        }
        else if (path.includes("EvidenceAI")) {
            return "EvidenceAI"
        }
        else{
            return null; 
        }
    }

    const getAbsolutePath=(path)=>{
        return path.replace("./evidence/repository/", "");
    }


    return(
        <div className={className}>
                {evidence.length === 0 ? (
                    <span className='evidence_heading'>
                        <p className='loading_text'>Loading evidence....</p>
                        <Spinner animation="border" className='loading_icon'/>
                    </span>
                ) : (
                    <span className='evidence_heading'>
                        <p className='evidence_heading_text'>Evidences to Support</p>
                    </span>
                )}
                {evidence.map((item, index) => (
                    <div className='evidence_item' key={index}>
                        <Row>
                            <Col className='project_name'>{getProject(item.file)} Project</Col>
                        </Row>
                        <Row>
                            <Col xs="auto" className='evidence_item_heading'> # File : </Col>
                        </Row>
                        <Row>
                            <Col>{getAbsolutePath(item.file)}</Col>
                        </Row>
                        <Row>
                            <Col xs="auto" className='evidence_item_heading'> # Description : </Col>
                        </Row>
                        <Row>
                            <Col>{item.description}</Col>
                        </Row>
                        <div className='evidence_code'>
                            <SyntaxHighlighter 
                                language="javascript"
                                style={oneDark}
                                showLineNumbers>
                                {item.code}
                            </SyntaxHighlighter>
                        </div>
                        <hr className="line"/>
                    </div>
                    
                ))}
        </div>
    );
}

export default Evidence;