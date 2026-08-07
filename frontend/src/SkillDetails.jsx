import './SkillDetails.css';

function SkillDetails({className, setSection, evidence}){
    return(
        <div className={className}>
            <span className='evidence_heading'>Evidence to Support</span>
                {evidence.map((item, index) => (
                    <div className='evidence_item'>
                        <p key={index}>{item.file}</p>
                        <p>{item.description}</p>
                        <div className='evidence_code'>
                            <pre>
                                {item.code}
                            </pre>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default SkillDetails;