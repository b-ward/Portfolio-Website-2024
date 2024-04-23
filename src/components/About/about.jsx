import React, {Component} from 'react';
import './about.css';
import { CardGroup } from 'react-bootstrap';
import SharedCard from '../Shared/card';

class About extends Component {
    render() {
        return(
            <div className="about">
                <img src='../BrendonWard.png' alt="Brendon Ward" className="about-img"/>
                <CardGroup style={{margin: '2rem 8vw 2rem 8vw'}}>
                    <SharedCard 
                        cardTitle="About Me"
                        cardBody="Hi! I'm Brendon. I'm a consultant based in Sydney, Australia and have a passion for IT and all things in between. I've built this site to show off some of my personal projects I've worked on, photography and videography I've captured and highlight my experience in an online CV. Feel free to reach out through my contact details below!"
                    />
                    <SharedCard 
                        cardTitle="Contact Details"
                        cardBody={<div>Email: brendon.c.ward@gmail.com <br /> 
                                        Mobile: 0401 718 987 <br /> 
                                        LinkedIn: <a href="https://www.linkedin.com/in/brendon-c-ward/" target="_blank" rel="noreferrer">https://www.linkedin.com/in/brendon-c-ward/</a>
                                </div>}
                    />
                    <SharedCard 
                        cardTitle="About This Site"
                        cardBody={<div>I've been meaning to make a personal website for a while now but never have had the time and design skills to flesh one out and get it up and running. The other reason was that from past experiences with uni projects, there can often be some recurring costs with hosting a website that I wasn't prepared to pay for if no-one was using it.
                        I did some research and found this cool site called Netlify. Netlify basically allows you to host serverless websites for free, which worked perfectly for me as I only needed to serve content to the user to show off my experience and personal projects. Netlify ends up costing money when you start having thousands of concurrent users and site visitors, which I suspect won't be a problem for this site.
                        After I found this tool and set up a quick website to make sure everything worked as I wanted, I got to work on setting up a GitHub repo and React project that would house my little website. I'm not particularly design-savvy so I found a tutorial that I wanted to base my design off (<a href="https://www.youtube.com/watch?v=n8iA18R76jk">https://www.youtube.com/watch?v=n8iA18R76jk</a>), but didn't really follow the coding done behind the scenes as I wanted to try and do as much as I could myself.
                        I also utilised this tutorial to design and implement the side drawer you'll find on every page: <a href="https://www.youtube.com/watch?v=l6nmysZKHFU">https://www.youtube.com/watch?v=l6nmysZKHFU</a>. Other than that I've tried to develop everything myself (with some help from stack overflow - as all developers do). You can check out my GitHub repo for the website here: <a href="https://github.com/b-ward/Portfolio-Website">https://github.com/b-ward/Portfolio-Website</a>
                        </div>}
                    />
                </CardGroup>
            </div>
        )
    }
}

export default About;