import React from 'react';
import './About.css';

const teamMembers = [
  {
    name: 'Cecyl Ursula Damo',
    nim: '220211060005',
    role: 'Fullstack Developer',
    image: "/images/cecyl.jpg",
    social: {
      linkedin: '#',
      instagram: '#',
      youtube: '#',
    },
  },
  {
    name: 'Happy Pricillia Wongkar',
    nim: '220211060009',
    role: 'Fullstack Developer',
    image: "/images/piwi.jpg",
    social: {
      linkedin: '#',
      instagram: '#',
      youtube: '#',
    },
  },
  {
    name: 'Veronica Waeo',
    nim: '220211060123',
    role: 'Fullstack Developer',
    image: "/images/veronica.jpg",
    social: {
      linkedin: '#',
      instagram: '#',
      youtube: '#',
    },
  },
];

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="team-section text-center">
        <div className="container">
          <h2>
            Team <span>Members</span>
          </h2>
          <p className="text-muted">
            Kami adalah mahasiswa UNSRAT yang tergabung dalam mata kuliah Pengembangan Aplikasi Web Berbasis Framework.
          </p>
          <div className="row justify-content-center mt-4 g-4">
            {teamMembers.map((member, index) => (
              <div className="col-sm-6 col-md-4 d-flex align-items-stretch" key={index}>
                <div className="team-card w-100">
                  <img src={member.image} alt={member.name} />
                  <div className="card-footer">
                    <h5>{member.name}</h5>
                    <h6>{member.nim}</h6>
                    <p>{member.role}</p>
                    <div className="social-icons">
                      <a href={member.social.linkedin}><i className="fab fa-linkedin"></i></a>
                      <a href={member.social.instagram}><i className="fab fa-instagram"></i></a>
                      <a href={member.social.youtube}><i className="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
