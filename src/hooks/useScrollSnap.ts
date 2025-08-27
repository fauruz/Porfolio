import { useEffect } from 'react';

export const useScrollSnap = () => {
  useEffect(() => {
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const isInsideModal = (element: EventTarget) => {
      return (element as HTMLElement).closest('.modal-backdrop') !== null;
    };

    const goToSection = (direction: number) => {
      if (isScrolling) return;
      
      const currentPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionHeight = windowHeight;
      const currentSection = Math.round(currentPos / sectionHeight);
      const totalSections = document.querySelectorAll('.screen').length;    
      let targetSection: number;
      
      if (direction > 0) {
        targetSection = Math.min(currentSection + 1, totalSections);
      } else {
        targetSection = Math.max(currentSection - 1, 0);
      }
      
      isScrolling = true;
      
      window.scrollTo({
        top: targetSection * sectionHeight,
        behavior: 'smooth'
      });
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 300);
    };

    const handleWheel = (e: WheelEvent) => {
      // 👈 THÊM ĐIỀU KIỆN NÀY
      if (isInsideModal(e.target)) {
        return; // Không xử lý scroll nếu đang ở trong modal
      }
      
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      goToSection(direction);
    };

    const handleTouchStart = (e: TouchEvent) => {
      // 👈 THÊM ĐIỀU KIỆN NÀY
      if (isInsideModal(e.target)) {
        return;
      }
      
      const touchStartY = e.touches[0].clientY;
      (e.currentTarget as HTMLElement).setAttribute('data-touch-start', touchStartY.toString());
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // 👈 THÊM ĐIỀU KIỆN NÀY
      if (isInsideModal(e.target) || isScrolling) {
        return;
      }
      
      const touchStartY = parseInt((e.currentTarget as HTMLElement).getAttribute('data-touch-start') || '0');
      const touchEndY = e.changedTouches[0].clientY;
      const direction = touchEndY < touchStartY ? 1 : -1;
      goToSection(direction);
    };

    const handleScroll = () => {
      if (isScrolling) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const currentPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const currentSection = Math.round(currentPos / windowHeight);
        
        window.scrollTo({
          top: currentSection * windowHeight,
          behavior: 'smooth'
        });
      }, 100);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
};