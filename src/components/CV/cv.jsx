import React from 'react';
import SharedCard from '../Shared/card';

const CV = () => (
  <div>
    <img
      src="/BrendonWard.png"
      alt="Brendon Ward"
      className="mt-14 w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] mx-auto block"
    />
    <h1 className="text-center">CV</h1>
    <div className="mx-[8vw] my-8">
      <h3 className="text-accent mt-5">Career Summary</h3>
      <SharedCard
        cardBody="G'day! I'm Brendon, an IT Professional with extensive experience in Software Development, Project Management and Cyber Security. I have strong communication, organisational and technical skills to lead cross-functional teams. I am hard working with a passion for all things tech."
      />
      <h3 className="text-accent mt-5">Experience</h3>
      <SharedCard
        imageSrc="/CV/WTG.jpg"
        cardTitle="WiseTech Global | Product Specialist | April 2022 - Present"
        cardBody={["- Product lead for MDM CORE sub-team that specialises in Master Data Management, Address Validation (>1 million requests per month), Credit Reports (100 users/month) and Organisation Automation product suite for CargoWise One.", <br key="1"/>,
        "- Working closely with the Product Manager to develop team roadmap and goals.", <br key="2"/>,
        "- Developed ongoing relationships with CargoWise customers to identify industry problems and gaps in current solutions. ", <br key="3"/>,
        "- Responsible for the development and mentoring of new team members. Teaching skills in product design, usability testing and communication with customers. Selected and participated in Mentoring Program.", <br key="4"/>,
        "- Actioning technical customer service incidents, including defects, feature requests, quotations and training questions."]}
      />
      <SharedCard
        imageSrc="/CV/EY.png"
        cardTitle="EY | Senior Consultant | Nov 2019 - April 2022"
        cardBody={["- Involved in development, testing, infrastructure support, requirements gathering and project management of eDNA, a web application for managing cyber security risks. The tool leverages a React front-end, C# back-end, MSSQL Server database and is hosted on Azure utilising Azure DevOps for automated deployment.", <br key="1"/>,
        "- Completed third party supplier assessments on behalf of Pepper and Woolworths. This included assessing the suppliers against the company's internal policies and cyber security standards such as ISO 27001, NIST and ASD-35." , <br key="2"/>,
        "- Carried out security assessments at Macquarie bank and Blooms the chemist, determining risks within internal applications being implemented across the business." , <br key="3"/>,
        "- Completed Security Architecture and Threat Modelling work at Aesop using the ATASM process and MITRE ATT&CK Methods.", <br key="4"/>,
        "- Performed penetration test scoping at ANZ. This involved understanding the architecture of the project, putting together test cases based on the implemented architecture, liaising with stakeholders to complete testing on time and managing deliverables throughout the testing process."]}
      />
      <SharedCard
        imageSrc="/CV/aleron.png"
        cardTitle="Aleron | Security Consultant | Jan 2019 - Nov 2019"
        cardBody="In this role, I was involved with security auditing as well as working as a developer, tester, business analyst and project manager of eDNA, a web application for managing cyber security risks."
      />
      <SharedCard
        imageSrc="/CV/nielsen.jpg"
        cardTitle="Nielsen | Systems Analyst | May 2018 - Dec 2018"
        cardBody="Scripted television ratings analysis and report generation using Python and developed a file monitoring system using Angular and Node.js. Gained a comprehensive understanding of Git and AWS services including S3, Lambda, RDS and EC2."
      />
      <SharedCard
        imageSrc="/CV/wisetech.png"
        cardTitle="WiseTech Global | Associate Developer | Jul 2017 - Dec 2017"
        cardBody="Rotated through multiple teams developing code for the main software product, CargoWise One. Development work included C# and SQL."
      />
      <SharedCard
        imageSrc="/CV/uts.png"
        cardTitle="UTS | Student Promotions Representative | Jun 2017 - Jul 2019"
        cardBody="Involved assisting at UTS events by performing administrative activities, building tours, registration and providing information on different courses. Some of the main events I helped with were UTS Open Day, UTS Info Day and the FEIT Capstone Showcase."
      />
      <SharedCard
        imageSrc="/CV/hoyts.jpg"
        cardTitle="Hoyts | Crew Member & Host | Nov 2013 - May 2017"
        cardBody="Involved ticket collection, cleaning, sales and ushering. Trained new starters between June 2015 and May 2017."
      />
      <h3 className="text-accent mt-5">Certifications</h3>
      <SharedCard
        imageSrc="/CV/BBIT.jpg"
        cardTitle="Black Belt in Thinking (Foundations) | April 2023"
        cardBody="Black Belt in Thinking is a course focused on improving critical thinking skills. Participants learn practical techniques to analyze information, make better decisions, and avoid common reasoning errors. The course covers logical reasoning, problem-solving, and creativity, helping individuals navigate challenges effectively."
      />
      <SharedCard
        imageSrc="/CV/microsoft.png"
        cardTitle="Microsoft Certified: Azure Security Engineer Associate (AZ-500) | Jul 2020"
        cardBody="This exam assesses the ability to accomplish the following technical tasks within Azure: manage identity and access; implement platform protection; manage security operations; and secure data and applications."
      />
      <h3 className="text-accent mt-5">Education</h3>
      <SharedCard
        imageSrc="/CV/uts.png"
        cardTitle="UTS | Bachelor of Information Technology (Co-op) | 2017 - 2019 | 6.35 GPA/83.09 WAM"
        cardBody="This is a cooperative education scholarship program in computer information systems, developed by UTS in cooperation with a group of leading organisations. It differs from other cooperative education courses in that, during the industry-based sessions, students follow a structured program designed jointly by UTS and the employer group, including formal coursework delivered by industry."
      />
      <SharedCard
        imageSrc="/CV/chs.png"
        cardTitle="Chatswood High School | 2011 - 2016 | 97.40 ATAR"
        cardBody="Throughout my time at Chatswood High School I participated in many extracurricular activities including: Duke of Edinburgh, Band, SRC and High Resolves. During Year 12, I also received high achievers awards for Mathematics and Physics, and Dux of Software Design and Development."
      />
    </div>
  </div>
);

export default CV;
