import React, { useState, useCallback, useMemo } from 'react';
import Folder from '../Folder/Folder';
import Modal from '../Modal/Modal';
import useLatestImage from '../../hooks/useLatestImage';
import './About.css';

const About: React.FC = () => {
  const [openModal, setOpenModal] = useState<null | 'Collection' | 'Me'>(null);
  
  // 🎯 Sử dụng hooks với cache - chỉ gọi API 1 lần cho mỗi folder
  const { 
    imageUrl: collectionImage, 
    loading: collectionLoading,
    error: collectionError 
  } = useLatestImage('Collection');
  
  const { 
    imageUrl: meImage, 
    loading: meLoading,
    error: meError 
  } = useLatestImage('Me');

  // 🔧 Optimized handlers với useCallback
  const handleOpenCollection = useCallback(() => {
    setOpenModal('Collection');
  }, []);

  const handleOpenMe = useCallback(() => {
    setOpenModal('Me');
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(null);
  }, []);

  // 📊 Memoize folder data để tránh re-render không cần thiết
  const folderData = useMemo(() => [
    {
      id: 'collection',
      imageSrc: collectionImage || '/a.jpg',
      title: 'Collection',
      loading: collectionLoading,
      error: collectionError,
      onOpen: handleOpenCollection
    },
    {
      id: 'me', 
      imageSrc: meImage || '/a.jpg',
      title: 'Me',
      loading: meLoading,
      error: meError,
      onOpen: handleOpenMe
    }
  ], [
    collectionImage, collectionLoading, collectionError, handleOpenCollection,
    meImage, meLoading, meError, handleOpenMe
  ]);

  return (
    <section id="about" className="screen">
      <div className="section-content">
        <h2>About Me</h2>
        <div className="about-content">
          <p>
            I am a passionate and creative web developer with expertise in modern web technologies. 
            With years of experience in the industry, I specialize in creating beautiful, responsive, 
            and user-friendly websites and applications.
          </p>
          <p>
            My skills include HTML5, CSS3, JavaScript, React, Node.js, and various other modern 
            frameworks and tools. I believe in writing clean, maintainable code and creating 
            exceptional user experiences.
          </p>

          <div className="collection">
            {folderData.map((folder) => (
              <Folder
                key={folder.id}
                imageSrc={folder.imageSrc}
                title={folder.title}
                loading={folder.loading}
                error={folder.error}
                onOpen={folder.onOpen}
              />
            ))}
          </div>

          <div className="skills">
            <h3>Skills</h3>
            <div className="skill-tags">
              <span className="skill-tag">HTML5</span>
              <span className="skill-tag">CSS3</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">React</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">Git</span>
              <span className="skill-tag">Responsive Design</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Chỉ render Modal khi cần, với optimized props */}
      {openModal && (
        <Modal 
          open={true} // Luôn true vì chỉ render khi openModal có giá trị
          onClose={handleCloseModal}
          folder={openModal}
        />
      )}
    </section>
  );
};

export default About;