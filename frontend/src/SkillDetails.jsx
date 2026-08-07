import './SkillDetails.css';

function SkillDetails({className, setSection, evidence}){
    return(
        <div className={className}>
             {evidence}
        </div>
    );
}

export default SkillDetails;