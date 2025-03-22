import React from 'react'
import "./About.css"
import img1 from './images/qn.jpg'
export const About = () => {
  return (
    <div className='about-container'>
      <img src={img1}  alt="question mark" />
      <div className='text'>
        <h1>About Us </h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore magni accusamus adipisci explicabo sunt eaque odio reprehenderit consequatur quibusdam illum autem facere eligendi laborum laudantium cumque voluptate placeat, esse ipsam hic ipsum ducimus. Accusamus incidunt ullam quos, aperiam neque, odit eos vitae necessitatibus quasi animi nulla nesciunt deserunt, odio aliquid laudantium deleniti ea adipisci molestias. Officia, animi perspiciatis. Odit error eum optio magni molestiae eius voluptate architecto, dolor similique ipsum velit, quae assumenda consequatur animi.
        </p>
      </div>
      
    </div>
  )
}
