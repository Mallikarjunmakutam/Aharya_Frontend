import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductSection from '../components/ProductSection';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const handleSetActiveCategory = (category) => {
    const params = {};
    if (category && category !== 'All') {
      params.category = category;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    // Changing filters resets the page back to 1
    setSearchParams(params);
  };

  const handleSetCurrentPage = (page) => {
    const params = {};
    if (activeCategory && activeCategory !== 'All') {
      params.category = activeCategory;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    if (page > 1) {
      params.page = page.toString();
    }
    setSearchParams(params);
  };

  const handleSelectProduct = (product) => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <ProductSection
      searchQuery={searchQuery}
      activeCategory={activeCategory}
      setActiveCategory={handleSetActiveCategory}
      currentPage={currentPage}
      setCurrentPage={handleSetCurrentPage}
      onSelectProduct={handleSelectProduct}
    />
  );
}
