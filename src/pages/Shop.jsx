import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductSection from '../components/ProductSection';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'All';

  const handleSetActiveCategory = (category) => {
    const params = {};
    if (category && category !== 'All') {
      params.category = category;
    }
    if (searchQuery) {
      params.search = searchQuery;
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
      onSelectProduct={handleSelectProduct}
    />
  );
}
