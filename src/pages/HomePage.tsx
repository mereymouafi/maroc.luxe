import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Luxe Maroc | Premium Luxury Goods</title>
        <meta name="description" content="Discover the finest luxury goods at Luxe Maroc. Elegant designs, exceptional quality, worldwide shipping." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg" 
            alt="Luxury handbag collection" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4">Exceptional Luxury</h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Experience the pinnacle of craftsmanship and design with our exquisite collection
            </p>
            <div className="space-x-4">
              <Link to="/shop" className="btn btn-gold">
                Shop Collection
              </Link>
              <Link to="/about" className="btn btn-secondary bg-transparent border border-white text-white hover:bg-white hover:text-luxury-black">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-luxury-cream">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-black mb-3">Shop Categories</h2>
            <p className="text-luxury-gray max-w-2xl mx-auto">
              Explore our carefully curated collections of the finest luxury goods
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, title: 'Handbags', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', link: '/shop/handbags' },
              { id: 2, title: 'Accessories', image: 'https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg', link: '/shop/accessories' },
              { id: 3, title: 'Collections', image: 'https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg', link: '/shop/collections' },
            ].map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: category.id * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden"
              >
                <Link to={category.link} className="block relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-serif mb-2">{category.title}</h3>
                    <span className="flex items-center text-sm font-medium">
                      Shop Now 
                      <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-black mb-3">New Arrivals</h2>
            <p className="text-luxury-gray max-w-2xl mx-auto">
              Discover our latest additions to the Luxe Maroc collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, name: 'Elegant Tote Bag', price: 1950, image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg' },
              { id: 2, name: 'Classic Shoulder Bag', price: 2250, image: 'https://images.pexels.com/photos/8390642/pexels-photo-8390642.jpeg' },
              { id: 3, name: 'Signature Wallet', price: 850, image: 'https://images.pexels.com/photos/4452526/pexels-photo-4452526.jpeg' },
              { id: 4, name: 'Luxury Watch', price: 3750, image: 'https://images.pexels.com/photos/9982109/pexels-photo-9982109.jpeg' },
            ].map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: product.id * 0.1 }}
                viewport={{ once: true }}
                className="group product-card-hover"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="btn btn-gold w-full text-sm py-2">
                        Quick View
                      </button>
                    </div>
                  </div>
                  <h3 className="font-serif text-luxury-black text-lg mb-1">{product.name}</h3>
                  <p className="text-luxury-gold font-medium">${product.price.toLocaleString()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/shop" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-luxury-black text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg" 
                alt="Artisan crafting a luxury bag" 
                className="w-full h-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-luxury-gold mb-6">Crafting Excellence</h2>
              <p className="mb-4 text-gray-300">
                Since our inception, Luxe Maroc has stood for unparalleled quality and timeless elegance. We combine traditional craftsmanship with contemporary design to create pieces that transcend trends.
              </p>
              <p className="mb-6 text-gray-300">
                Each Luxe Maroc creation is meticulously handcrafted by master artisans using only the finest materials sourced from around the world. We pride ourselves on attention to detail, ensuring that every stitch and finish meets our exacting standards.
              </p>
              <Link to="/about" className="btn btn-gold">
                Discover Our Story
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-black mb-3">Client Experiences</h2>
            <p className="text-luxury-gray max-w-2xl mx-auto">
              What our valued clients say about their Luxe Maroc experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                id: 1, 
                name: 'Sophia Laurent', 
                location: 'Paris, France',
                quote: 'The craftsmanship of my Luxe Maroc bag is exceptional. Every detail is perfect, and it has become my favorite accessory for every occasion.' 
              },
              { 
                id: 2, 
                name: 'Jonathan Pierce', 
                location: 'New York, USA',
                quote: 'The quality and design of Luxe Maroc products are unmatched. Their attention to detail and customer service exceed all expectations.' 
              },
              { 
                id: 3, 
                name: 'Isabella Rossi', 
                location: 'Milan, Italy',
                quote: 'As someone who appreciates fine craftsmanship, I can say that Luxe Maroc delivers on its promise of luxury and elegance.' 
              },
            ].map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-black font-serif text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-luxury-black">{testimonial.name}</h3>
                    <p className="text-sm text-luxury-gray">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-luxury-gray italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-luxury-cream">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-luxury-black mb-4">Join Our Community</h2>
            <p className="text-luxury-gray mb-8">
              Subscribe to our newsletter to receive updates on new collections, exclusive offers, and invitations to events.
            </p>
            
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="luxury-input flex-grow"
                  required 
                />
                <button type="submit" className="btn btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-luxury-gray mt-3">
                By subscribing, you agree to our <Link to="/privacy-policy" className="underline">Privacy Policy</Link> and consent to receive updates from Luxe Maroc.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;