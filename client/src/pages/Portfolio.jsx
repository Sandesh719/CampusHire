import React, { useState, useEffect } from 'react';
import { MetaData } from '../components/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Portfolio = () => {
  const { loading, me, isLogin } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [portfolioData, setPortfolioData] = useState({
    githubLink: '',
    linkedinLink: '',
    portfolioLink: '',
    projects: [],
    description: ''
  });

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    projectLink: '',
    technologies: ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false); // Add this missing state

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
    // Fetch existing portfolio data when component mounts
    fetchPortfolioData();
  }, [isLogin, navigate]);

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch('/api/v1/portfolio', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPortfolioData(data.portfolio || portfolioData);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addProject = () => {
    if (!newProject.title || !newProject.description) {
      toast.error('Project title and description are required');
      return;
    }

    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...newProject, id: Date.now() }]
    }));

    setNewProject({
      title: '',
      description: '',
      projectLink: '',
      technologies: ''
    });
    
    toast.success('Project added successfully!'); // Added success feedback
  };

  const removeProject = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
    toast.info('Project removed'); // Added feedback
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      toast.success('Resume selected'); // Added feedback
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const savePortfolio = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('githubLink', portfolioData.githubLink);
      formData.append('linkedinLink', portfolioData.linkedinLink);
      formData.append('portfolioLink', portfolioData.portfolioLink);
      formData.append('description', portfolioData.description);
      formData.append('projects', JSON.stringify(portfolioData.projects));
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      console.log('Saving portfolio data...');

      const response = await fetch('/api/v1/portfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Don't set Content-Type for FormData
        },
        body: formData
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.success) {
        toast.success('Portfolio saved successfully!');
      } else {
        toast.error(data.message || 'Failed to save portfolio');
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast.error('Error saving portfolio: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isLogin) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title="My Portfolio" />
      <div className='bg-gray-950 min-h-screen pt-14 md:px-20 px-3 text-white'>
        {loading ? <Loader /> : (
          <div className='max-w-4xl mx-auto py-8'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl font-bold'>My Portfolio</h1>
              <p className='text-gray-400 mt-2'>Showcase your skills and projects</p>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              {/* Left Column - Basic Info */}
              <div className='space-y-6'>
                <div>
                  <label className='block text-lg mb-2'>GitHub Profile</label>
                  <input
                    type="url"
                    name="githubLink"
                    value={portfolioData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className='block text-lg mb-2'>LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedinLink"
                    value={portfolioData.linkedinLink}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className='block text-lg mb-2'>Portfolio Website</label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={portfolioData.portfolioLink}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className='block text-lg mb-2'>Upload Resume (PDF)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  />
                  {resumeFile && (
                    <p className='text-green-400 mt-2'>Selected: {resumeFile.name}</p>
                  )}
                </div>
              </div>

              {/* Right Column - Description & Projects */}
              <div className='space-y-6'>
                <div>
                  <label className='block text-lg mb-2'>About Me</label>
                  <textarea
                    name="description"
                    value={portfolioData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself, your skills, and interests..."
                    rows="4"
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                {/* Add Project Section */}
                <div className='bg-gray-800 p-4 rounded'>
                  <h3 className='text-xl font-semibold mb-4'>Add Project</h3>
                  
                  <div className='space-y-3'>
                    <input
                      type="text"
                      name="title"
                      value={newProject.title}
                      onChange={handleProjectChange}
                      placeholder="Project Title"
                      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                    
                    <textarea
                      name="description"
                      value={newProject.description}
                      onChange={handleProjectChange}
                      placeholder="Project Description"
                      rows="2"
                      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                    
                    <input
                      type="url"
                      name="projectLink"
                      value={newProject.projectLink}
                      onChange={handleProjectChange}
                      placeholder="Project Live Demo / GitHub Link"
                      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                    
                    <input
                      type="text"
                      name="technologies"
                      value={newProject.technologies}
                      onChange={handleProjectChange}
                      placeholder="Technologies used (comma separated)"
                      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                    
                    <button
                      onClick={addProject}
                      className="w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Add Project
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects List */}
            {portfolioData.projects.length > 0 && (
              <div className='mt-8'>
                <h3 className='text-2xl font-semibold mb-4'>Your Projects ({portfolioData.projects.length})</h3>
                <div className='space-y-4'>
                  {portfolioData.projects.map((project, index) => (
                    <div key={index} className='bg-gray-800 p-4 rounded'>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <h4 className='text-xl font-semibold'>{project.title}</h4>
                          <p className='text-gray-300 mt-2'>{project.description}</p>
                          {project.projectLink && (
                            <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className='text-yellow-400 hover:underline mt-2 block'>
                              View Project →
                            </a>
                          )}
                          {project.technologies && (
                            <div className='flex flex-wrap gap-2 mt-2'>
                              {project.technologies.split(',').map((tech, i) => (
                                <span key={i} className='bg-gray-700 px-2 py-1 rounded text-sm'>
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeProject(index)}
                          className='text-red-400 hover:text-red-300 ml-4'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className='mt-8 text-center'>
              <button
                onClick={savePortfolio}
                disabled={saving}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Portfolio'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};