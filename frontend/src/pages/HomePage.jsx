import React from 'react';
import SearchSection from '../components/SearchSection';
import InfoBanner from '../components/InfoBanner';
import ContentCards from '../components/ContentCards';

const HomePage = () => {
  return (
    <>
      <SearchSection />
      <InfoBanner />
      <ContentCards />
    </>
  );
};

export default HomePage;