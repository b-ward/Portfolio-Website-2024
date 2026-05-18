import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ src, title, description, route }) => (
  <Link to={route} className="no-underline text-black">
    <div className="bg-white text-black rounded-lg overflow-hidden hover:shadow-lg hover:scale-105 transition-transform duration-150">
      <img src={src} alt={title} className="h-[150px] w-full object-cover" />
      <div className="p-4">
        <h5 className="font-semibold mb-2">{title}</h5>
        <p className="h-[80px] overflow-hidden text-sm">{description}</p>
      </div>
    </div>
  </Link>
);

export default ProjectCard;
