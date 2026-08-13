import './Evidence.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffectEvent, useState } from 'react';


function Evidence({className, evidence}){
    const [codeEvidence, setCodeEvidence] = useState({});
    const getProject=(path)=>{
        if (path.includes("askmentor")) {
            return "AskMentor";
        }
        else if (path.includes("datagenesys")) {
            return "DataPredictify";
        }
        else if (path.includes("evidenceai")) {
            return "EvidenceAI"
        }
        else{
            return null; 
        }
    }

    return(
        <div className={className}>
                <span className='evidence_heading'>
                    <p className='evidence_heading_text'>Evidences to Support</p>
                    <p className='suggestion'> 
                        Only a few code files are displayed as evidence, 
                        rather than all the relevant code files. These are verified from Prajakta’s portfolio!
                    </p>
                </span>
                {evidence.map((item, index) => (
                    <div className='evidence_item' key={index}>
                        <Row>
                            <Col className='curr_project_name'>{item.project} Project</Col>
                        </Row>
                        <Row>
                            <Col xs="auto" className='evidence_item_heading'> # File : </Col>
                        </Row>
                        <Row>
                            <Col>{(item.file)}</Col>
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