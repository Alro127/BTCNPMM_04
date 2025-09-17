import { Carousel, Image } from "antd";

const ProductImages = ({ images = [], mainImage }) => {
  const allImages = [mainImage, ...(images || [])].filter(Boolean);

  return (
    <Carousel autoplay dots={{ className: "custom-dots" }}>
      {allImages.length > 0 ? (
        allImages.map((img, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <Image
              src={img}
              alt={`product-${i}`}
              width="100%"
              height={350}
              style={{ objectFit: "contain", borderRadius: 12, background: "#fafafa" }}
            />
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Image
            src="https://via.placeholder.com/350x350?text=No+Image"
            alt="no-image"
            width="100%"
            height={350}
            style={{ objectFit: "contain", borderRadius: 12, background: "#fafafa" }}
          />
        </div>
      )}
    </Carousel>
  );
};

export default ProductImages;
