import React from "react";
import "./testimonials.css";
import AVTR1 from "../../assets/psmelvinson.png";
import AVTR2 from "../../assets/amavs.png";
import AVTR3 from "../../assets/mahdyf.jpg";
import AVTR4 from "../../assets/tnoble.jpg";
import AVTR5 from "../../assets/shorrigan.png";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const peers = [
  {
    avatar: AVTR1,
    name: "Pawel Morysewicz",
    review:
      "Andrew is one of the best teammates I have ever worked with, he's a great listener, fast learner that provides help to anyone in the team if needed, and is very committed to the responsibilities that he has.",
  },
  {
    avatar: AVTR2,
    name: "Andrew Mavrogeorgis",
    review:
      "I had the chance to work with Andrew on different projects. His technical skills were always impressive. He constantly showed professional behavior and high level of problem-solving skills. Based on that, I would gladly recommend him as a software developer with his technical and soft skills.",
  },
  {
    avatar: AVTR3,
    name: "Mahdy Ferdaos",
    review:
      "Working alongside Andrew has been great. His learning is exponential. He is always eager to learn and improve his skills.",
  },
  {
    avatar: AVTR4,
    name: "Tyler Noble",
    review:
      "Andrew is next up in cyber. He is a great team player and has a strong work ethic.",
  },
  {
    avatar: AVTR5,
    name: "Samuel Horrigan",
    review:
      "There is no one that has more conviction than Andrew when it comes to data structures and algorithms.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials">
      <h5>Review from Peers</h5>
      <h2>Testimonials</h2>
      <Swiper
        className="container testimonials_container"
        navigation={true}
        modules={[Navigation]}
        spaceBetween={40}
        slidesPerView={1}
      >
        {peers.map(({ avatar, name, review }, index) => {
          return (
            <SwiperSlide key={index} className="testimonial">
              <div className="peer_avatar">
                <img src={avatar} alt={name} />
              </div>
              <h5 className="peer_name">{name}</h5>
              <small className="peer_review">{review}</small>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Testimonials;
