import React from 'react'
import HeroSection from '../componenets/Hero'
import DashboardShowcase from '../componenets/Features'
import Navbar from '../componenets/Layouts/Navbar'

function Home() {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <DashboardShowcase/>
    </div>
  )
}

export default Home