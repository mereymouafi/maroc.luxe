import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Luxe Maroc</title>
        <meta name="description" content="Discover the story behind Luxe Maroc, our commitment to craftsmanship, and our vision for luxury goods." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg" 
            alt="Luxury craftsmanship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Our Story</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            A journey of passion, craftsmanship, and timeless luxury
          </p>
        </div>
      </section>

      {/* Our Heritage */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif text-luxury-black mb-6">Our Heritage</h2>
              <p className="text-luxury-gray mb-4">
                Founded in 2010, Luxe Maroc began as a small atelier in Casablanca, dedicated to preserving traditional Moroccan craftsmanship while infusing it with contemporary design. Our founder, inspired by the rich cultural heritage of Morocco and the timeless elegance of European luxury, set out to create pieces that would stand the test of time.
              </p>
              <p className="text-luxury-gray mb-4">
                Over the years, we've grown from a small workshop to a respected luxury brand, but our core values remain unchanged. Every Luxe Maroc creation is still meticulously handcrafted by skilled artisans using time-honored techniques passed down through generations.
              </p>
              <p className="text-luxury-gray">
                Today, our collections are celebrated worldwide for their exceptional quality, distinctive design, and the perfect balance between tradition and innovation.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg" 
                alt="Luxe Maroc heritage" 
                className="w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-luxury-gold p-4 md:p-6">
                <p className="font-serif text-2xl text-luxury-black">Est. 2010</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-16 bg-luxury-cream">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-luxury-black mb-6">Our Philosophy</h2>
            <p className="text-luxury-gray mb-8">
              At Luxe Maroc, we believe that true luxury lies in the perfect harmony of exceptional materials, impeccable craftsmanship, and timeless design. We are committed to creating pieces that not only make a statement today but will be treasured for generations to come.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Craftsmanship",
                  description: "Every piece is handcrafted by skilled artisans who have dedicated their lives to perfecting their craft."
                },
                {
                  title: "Quality",
                  description: "We source only the finest materials from around the world to ensure exceptional quality and longevity."
                },
                {
                  title: "Sustainability",
                  description: "We are committed to ethical practices, supporting local communities, and minimizing our environmental impact."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-serif text-luxury-black mb-3">{item.title}</h3>
                  <p className="text-luxury-gray">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Process */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-serif text-luxury-black text-center mb-10">Our Craftsmanship</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Design",
                description: "Our creative team blends traditional Moroccan aesthetics with contemporary style to create timeless designs.",
                image: "https://images.pexels.com/photos/3774903/pexels-photo-3774903.jpeg"
              },
              {
                title: "Material Selection",
                description: "We source the finest materials, from premium leathers to exquisite textiles, ensuring exceptional quality.",
                image: "https://images.pexels.com/photos/5692315/pexels-photo-5692315.jpeg"
              },
              {
                title: "Handcrafting",
                description: "Skilled artisans cut, stitch, and assemble each piece by hand, ensuring precision and attention to detail.",
                image: "https://images.pexels.com/photos/4254073/pexels-photo-4254073.jpeg"
              },
              {
                title: "Finishing",
                description: "Each creation undergoes rigorous quality control before receiving the final Luxe Maroc seal of approval.",
                image: "https://images.pexels.com/photos/8148446/pexels-photo-8148446.jpeg"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="overflow-hidden"
              >
                <div className="aspect-square overflow-hidden mb-4">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-serif text-luxury-black mb-2">{step.title}</h3>
                <p className="text-luxury-gray">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-luxury-black text-white">
        <div className="container">
          <h2 className="text-3xl font-serif text-luxury-gold text-center mb-10">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophia Laurent",
                role: "Founder & Creative Director",
                bio: "With over 20 years of experience in luxury fashion, Sophia's vision and passion drive the creative direction of Luxe Maroc.",
                image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg"
              },
              {
                name: "Ahmed Benali",
                role: "Master Craftsman",
                bio: "Ahmed leads our team of artisans, bringing 30 years of traditional craftsmanship expertise to every Luxe Maroc creation.",
                image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
              },
              {
                name: "Isabelle Moreau",
                role: "Head of Design",
                bio: "Isabelle's innovative approach to design blends traditional Moroccan elements with contemporary aesthetics.",
                image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="aspect-square overflow-hidden mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif text-luxury-gold mb-1">{member.name}</h3>
                <p className="text-gray-400 mb-3">{member.role}</p>
                <p className="text-gray-300">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Our Store */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.pexels.com/photos/5699515/pexels-photo-5699515.jpeg" 
                alt="Luxe Maroc Boutique" 
                className="w-full h-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif text-luxury-black mb-6">Visit Our Boutique</h2>
              <p className="text-luxury-gray mb-6">
                We invite you to experience the world of Luxe Maroc in person at our flagship boutique in Casablanca. Step into a space where tradition meets modernity, and discover our collections in an atmosphere that reflects our commitment to exceptional craftsmanship and timeless elegance.
              </p>
              <p className="text-luxury-gray mb-8">
                Our knowledgeable staff will guide you through our collections, share the stories behind our pieces, and help you find the perfect Luxe Maroc creation.
              </p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-lg font-serif text-luxury-black">Location</h3>
                  <p className="text-luxury-gray">123 Fashion Avenue, Casablanca, Morocco</p>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-luxury-black">Hours</h3>
                  <p className="text-luxury-gray">Monday-Saturday: 10am-7pm</p>
                  <p className="text-luxury-gray">Sunday: 12pm-5pm</p>
                </div>
              </div>
              
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;