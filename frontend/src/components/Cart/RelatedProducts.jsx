import './Styles/RelatedProducts.css';

const relatedProducts = [
  {
    id: 101,
    name: 'Samsung Galaxy S22 Ultra',
    image: '../../assets/1wrist-watch.jpg',
    price: 350000,
  },
  {
    id: 102,
    name: 'Apple MacBook Pro 16-inch',
    image: '/assets/macbook-pro-16.jpg',
    price: 1800000,
  },
  {
    id: 103,
    name: 'Sony WH-1000XM4 Wireless Headphones',
    image: '/assets/sony-wh1000xm4.jpg',
    price: 110000,
  },
  {
    id: 104,
    name: 'Apple iPad Pro 12.9-inch',
    image: '/assets/ipad-pro-12.jpg',
    price: 900000,
  },
];

const RelatedProducts = () => {
  return (
    <section
      className="related-products"
      aria-labelledby="related-products-heading"
    >
      <h2 id="related-products-heading" className="related-products__title">
        Related Products
      </h2>

      <ul className="related-products__list" role="list">
        {relatedProducts.map(({ id, name, image, price }) => (
          <li key={id} className="related-products__item" role="listitem">
            <div className="related-products__card" tabIndex={0}>
              <img
                src={image}
                alt={name}
                className="related-products__image"
                loading="lazy"
              />
              <div className="related-products__info">
                <h3 className="related-products__name">{name}</h3>
                <p className="related-products__price">₦{price.toLocaleString()}</p>
                <button
                  className="related-products__btn"
                  aria-label={`View details for ${name}`}
                  onClick={() => alert(`Viewing product: ${name}`)} // Replace with navigation logic
                >
                  View
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelatedProducts;
