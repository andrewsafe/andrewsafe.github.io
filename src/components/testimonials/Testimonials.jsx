import React from "react";
import "./testimonials.css";
import AVTR1 from "../../assets/psmelvinson.png";
import AVTR2 from "../../assets/mahdyf.jpg";
import AVTR3 from "../../assets/tnoble.jpg";
import AVTR4 from "../../assets/shorrigan.png";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const peers = [
  {
    avatar: AVTR1,
    name: "Pawel Morysewicz",
    review:
      "Andrew is the best teammate I have ever worked with in and out of work.",
  },
  {
    avatar: AVTR2,
    name: "Mahdy Ferdaos",
    review:
      "Working alongside Andrew has been great. His learning is exponential. He is always eager to learn and improve his skills.",
  },
  {
    avatar: AVTR3,
    name: "Tyler Noble",
    review:
      "Andrew is next up in cyber. He is a great team player and has a strong work ethic.",
  },
  {
    avatar: AVTR4,
    name: "Samuel Horrigan",
    review:
      "There is no one that has more conviction than Andrew when it comes to data structures, algorithms, and system design.",
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
