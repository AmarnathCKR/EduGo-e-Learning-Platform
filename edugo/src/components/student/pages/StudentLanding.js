import React from 'react'
import HeaderLanding from '../layouts/HeaderLanding'
import FooterLanding from '../layouts/FooterLanding'
import MainContent from '../pageContents/MainContent'

function StudentLanding() {
  return (
    <div className='flex flex-col min-h-screen'>
        <HeaderLanding />
        <MainContent />
        <FooterLanding />
    </div>
  )
}

export default StudentLanding