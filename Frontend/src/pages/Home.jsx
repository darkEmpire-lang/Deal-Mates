import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import '../styles/Home.css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const bannerImages = [banner1, banner2, banner3];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://e-commerce-one-livid-92.vercel.app/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        const uniqueCategories = Array.from(new Set(data.map(product => product.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice || maxPrice) {
      filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, minPrice, maxPrice, category, products]);

  const handleShareClick = (link) => {
    setShareLink(link);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  const togglePriceFilter = () => {
    setShowPriceFilter(!showPriceFilter);
  };

  const resetPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setShowPriceFilter(false);
  };

  const filterProducts = () => {
    const filteredProducts = products.filter((product) => {
      const meetsCategory = category ? product.category === category : true;
      const meetsSearchTerm = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const meetsPriceRange = product.price >= minPrice && product.price <= maxPrice;
  
      return meetsCategory && meetsSearchTerm && meetsPriceRange;
    });
  
    console.log('Filtered Products:', filteredProducts);
  };

  return (
    <div className="home-container bg-light min-h-screen py-8">
      {/* Banner Section */}
      <div className="banner-section mb-4" style={{ marginTop: '20px', width: '100%' }}>
        <div className="banner-item" style={{ height: '250px', overflow: 'hidden' }}>
          <div className="banner-slider">
            <div className="banner-slide">
              <img
                src={bannerImages[currentBannerIndex]}
                alt={`Banner ${currentBannerIndex + 1}`}
                className="w-100"
                style={{
                  height: '250px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease-in-out',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="container d-flex justify-content-center align-items-center flex-column mb-4 p-4 rounded-lg shadow-lg bg-light"
        style={{ marginTop: '20px', maxWidth: '1400px' }}
      >
        {/* Category & Search Bar */}
        <div className="d-flex gap-3 w-100 mb-4 align-items-center">
          <select
            className="btn text-white"
            style={{
              minWidth: '150px',
              backgroundColor: '#ffa500',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none',
            }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex-grow d-flex position-relative" style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Search for products..."
              className="form-control p-3 rounded-lg shadow-sm"
              style={{ paddingRight: '50px', fontSize: '1.1rem', width: '100%' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="btn text-white"
            style={{
              backgroundColor: '#ffa500',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '8px',
            }}
            onClick={togglePriceFilter}
          >
            Price
          </button>
        </div>

        {/* Price Range Filter */}
        {showPriceFilter && (
          <div className="d-flex align-items-center gap-3 mb-4 w-100">
            <input
              type="number"
              placeholder="Min"
              className="form-control p-2 shadow-sm"
              style={{ width: '100px', borderRadius: '8px' }}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="form-control p-2 shadow-sm"
              style={{ width: '100px', borderRadius: '8px' }}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button
              className="btn text-white"
              style={{
                backgroundColor: '#ff8c00',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
              onClick={filterProducts}
            >
              Filter
            </button>

            <button
              className="btn text-white"
              style={{
                backgroundColor: '#ff8c00',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
              onClick={resetPriceFilter}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="container">
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card product-card shadow-sm rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="card-img-top"
                  style={{
                    height: '220px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                  }}
                />
                <div className="card-body p-3">
                  <h6 className="card-title" style={{
                    fontSize: '1rem', 
                    fontWeight: 'bold', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    maxWidth: '100%',
                    color: '#333',
                  }}>
                    {product.name}
                  </h6>
                  <p className="card-text" style={{ fontSize: '0.9rem', color: '#666' }}>
                    {product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="card-text" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#444' }}>
                      Rs {product.price}
                    </p>
                  </div>
                  <div className="d-flex gap-2 justify-content-between">
                    <a
                      href={product.buyNowLink}
                      className="btn text-white"
                      style={{
                        backgroundColor: '#ff8c00',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                      }}
                    >
                      Buy Now
                    </a>
                    <button
                      className="btn text-white"
                      style={{
                        backgroundColor: '#3b5998',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                      }}
                      onClick={() => handleShareClick(product.shareLink)}
                    >
                      <FaFacebook />
                    </button>
                    <button
                      className="btn text-white"
                      style={{
                        backgroundColor: '#e4405f',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                      }}
                      onClick={() => handleShareClick(product.shareLink)}
                    >
                      <FaInstagram />
                    </button>
                    <button
                      className="btn text-white"
                      style={{
                        backgroundColor: '#25d366',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                      }}
                      onClick={() => handleShareClick(product.shareLink)}
                    >
                      <FaWhatsapp />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={closeShareModal}>
          <div className="modal-content p-4 bg-white rounded-lg shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h4 className="text-center">Share this product</h4>
            <p className="text-center">Link: <a href={shareLink} target="_blank" rel="noopener noreferrer">{shareLink}</a></p>
            <div className="d-flex justify-content-center">
              <button className="btn btn-outline-secondary" onClick={closeShareModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
