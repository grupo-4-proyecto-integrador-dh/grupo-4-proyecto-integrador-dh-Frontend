import { useState, useEffect } from "react";
import CardP from "../Components/CardP";
import "../Styles/Productos.css";

const Productos = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const cardsPerPage = 10;
  const totalCards = 19;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  useEffect(() => {
    const fetchImages = async () => {
      const fetchedImages = [];
      for (let i = 0; i < totalCards; i++) {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();
        fetchedImages.push(data.message);
      }
      setImages(fetchedImages);
    };
    fetchImages();
  }, [totalCards]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderCards = () => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return images
      .slice(startIndex, endIndex)
      .map((imageUrl, index) => (
        <CardP
          key={startIndex + index}
          title={`Dog ${startIndex + index + 1}`}
          description="A random dog image"
          imageUrl={imageUrl}
        />
      ));
  };

  return (
    <main className="productos-container">
      <div className="cards">{renderCards()}</div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </main>
  );
};

export default Productos;
