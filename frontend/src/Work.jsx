import './Work.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';


function Work({className}){

    const experience = [
        {
            "position" : "IT Support", 
            "period" : "Jan 2025 - June 2026",
            "organization" : "University of Saskatchewan", 
            "location" : "Saskatoon, SK, Canada", 
            "responsibilities": [
                "Provided Level 1 technical support for students, faculty, and staff, resolving hardware, software, account, and connectivity issues.",
                "Delivered remote technical support using BeyondTrust, troubleshooting user devices and resolving issues without requiring in-person assistance.",
                "Managed IT service requests and documented resolutions using TeamDynamix, ensuring timely issue tracking and follow-up.",
                "Used Active Directoryto assist with user account management, password resets, and access-related requests.",
                "Utilized Lansweeper to locate, inventory, and manage university devices during troubleshooting and asset management tasks.",
                "Prepared, configured, deployed, and replaced desktops, laptops, monitors, and peripherals for university employees.",
                "Processed surplus equipment by securely preparing retired devices for disposal or redistribution according to university procedures.",
                "Set up and provided technical support for in-person, hybrid, and virtual meetings, ensuring audio, video, and conferencing systems functioned reliably.",
                "Inspected, tested, and maintained classroom technology, including computers, projectors, displays, microphones, and videoconferencing equipment, to ensure classrooms were ready for instruction."
            ], 
            "skills":[ "Technical Support","Windows", 
                        "Active Directory", 
                        "BeyondTrust", 
                        "TeamDynamix", 
                        "Lansweeper", 
                        "Device Deployment",
                        "IT Asset Management",
                        "AV Support",
                        "Microsoft 365",
                    ]
        },
        {
            "position" : "Marker- Department of Mathematics and Statistics", 
            "period" : "Sept 2024 - Apr 2026",
            "organization" : "University of Saskatchewan", 
            "location" : "Saskatoon, SK, Canada", 
            "responsibilities": [
                "Evaluated assignments and exams accurately and consistently.",
                "Provided constructive feedback to support student learning.",
                "Worked closely with instructors to maintain grading standards."
                ], 
            "skills": [
                "Attention to Detail",
                "Communication",
                "Time Management",
                "Academic Support"
            ]
        }
    ] 
    return(
        <div className={className}>
            {(experience).map((work)=>(
                <div className='work_timeline_item'>
                    <div className="timeline-dot"></div>
                    <div className='work_content'>
                        <Stack direction='horizontal'>
                            <h5 style={{fontWeight:"bold"}}>{work.position}</h5>
                            <span className='ms-auto work_period'>
                                <span class="material-symbols-outlined">calendar_month</span>
                                {work.period}
                            </span>
                        </Stack>
                        <Stack direction='horizontal' style={{fontSize:"small"}}>
                            <span style={{color:"rgb(129, 81, 242) "}}> {work.organization}</span>
                            <span className='ms-auto'> {work.location}</span>
                        </Stack>
                        <br/>
                        <span>
                            <ul>
                                {(work.responsibilities).map((res)=>(
                                    <li>{res}</li>
                                ))}
                            </ul>

                        </span>
                        <div className='work_skills'>
                            <Row>
                                <Col xs="auto">
                                    <span class="material-symbols-outlined bulb_icon">lightbulb_2</span>
                                </Col>
                                <Col>
                                    <span className='skill_title'> Skills Applied in the Role </span>
                                    <br/>
                                    {(work.skills).map((skill)=>(
                                        <span style={{fontSize:"small", marginRight:"1vh"}}>• {skill}</span>
                                    ))}
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="timeline-dot"></div>
                </div>
            ))}


            
        </div>

    )
}

export default Work;
