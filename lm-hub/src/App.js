import React from 'react' 
import NavBar from './components/NavBar'
import LMCard from './components/LMCard'
import Footer from './components/Footer'



const App = () => {

  return (
    <>
      <NavBar />
      <div className="bg-slate-400 h-full pt-10">
        <div className="p-8 justify-items-center ">
          <LMCard score={100} />
        </div>
        <div className="p-8 justify-items-center ">
          <LMCard score={75} />
        </div>
        <div className="p-8 justify-items-center ">
          <LMCard score={50} />
        </div>
        <div className="p-8 justify-items-center ">
          <LMCard score={25} />
        </div>
      </div>
      <Footer />
      

      
    </>
    
  )
}

export default App