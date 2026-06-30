import { useParams, useNavigate } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back in browser history (returns to previous shop list page)
  };

  return <ProductDetail product={{ id: slug }} onBack={handleBack} />;
}
