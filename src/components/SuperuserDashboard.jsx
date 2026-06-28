import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import s from './SuperuserDashboard.module.css';

// --- SVG Icons ---
const OverviewIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const OrdersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const ProductsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const UsersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const CameraIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
);

export default function SuperuserDashboard({ setViewMode }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        total_users: 0,
        total_products: 0,
        total_orders: 0,
        total_sales: 0,
        pending_orders: 0,
        low_stock_products: 0
    });

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Loading States
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Modals
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null means adding new product

    // Product Form State
    const [productForm, setProductForm] = useState({
        name: '',
        item_code: '',
        category_id: '',
        fabric: '',
        price: '',
        discount_price: '',
        stock: 0,
        description: '',
        is_featured: false,
        is_active: true
    });
    const [productImages, setProductImages] = useState([]);
    const [selectedLocalImages, setSelectedLocalImages] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const handleVideoSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    const handleRemoveVideo = async () => {
        setVideoFile(null);
        setVideoPreview(null);
        if (editingProduct && editingProduct.video) {
            try {
                await api.patch(`/products/${editingProduct.id}/`, { video: null });
                editingProduct.video = null;
                fetchProducts();
            } catch (err) {
                console.error("Failed to remove video", err);
            }
        }
    };

    // Fetch Stats
    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            const res = await api.get('/dashboard/stats/');
            setStats(res.data);
        } catch (e) {
            console.error("Error fetching admin stats", e);
        } finally {
            setLoadingStats(false);
        }
    };

    // Fetch Orders
    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const res = await api.get('/orders/');
            setOrders(res.data.results || res.data || []);
        } catch (e) {
            console.error("Error fetching admin orders", e);
        } finally {
            setLoadingOrders(false);
        }
    };

    // Fetch Products & Categories
    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const res = await api.get('/products/');
            setProducts(res.data.results || res.data || []);
        } catch (e) {
            console.error("Error fetching admin products", e);
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/products/categories/');
            setCategories(res.data.results || res.data || []);
        } catch (e) {
            console.error("Error fetching categories", e);
        }
    };

    // Fetch Users
    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const res = await api.get('/users/admin-users/');
            setUsers(res.data.results || res.data || []);
        } catch (e) {
            console.error("Error fetching admin users", e);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (activeTab === 'overview') {
            fetchStats();
            fetchOrders();
        } else if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'users') {
            fetchUsers();
        }
        setSearchQuery('');
        setStatusFilter('All');
        setCategoryFilter('All');
    }, [activeTab]);

    // Handle Quick Stock Changes
    const handleQuickStockChange = async (product, newStock) => {
        if (newStock < 0) return;
        try {
            // Optimistic Update
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
            await api.patch(`/products/${product.id}/`, { stock: newStock });
            fetchStats(); // Update stats
        } catch (e) {
            console.error("Failed to update stock", e);
            // Rollback
            fetchProducts();
        }
    };

    // Handle Order Status / Shipping Update
    const handleOrderStatusUpdate = async (orderId, updates) => {
        try {
            const res = await api.patch(`/orders/${orderId}/`, updates);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...res.data } : o));
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, ...res.data }));
            }
            fetchStats(); // Update low stock/sales dashboard numbers
        } catch (e) {
            console.error("Failed to update order status", e);
            alert("Error updating order status");
        }
    };

    // Handle User Toggle Status
    const handleUserToggle = async (userId, field, currentVal) => {
        try {
            const updates = { [field]: !currentVal };
            const res = await api.patch(`/users/admin-users/${userId}/`, updates);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...res.data } : u));
        } catch (e) {
            console.error(`Failed to toggle user ${field}`, e);
            alert("Error updating user credentials");
        }
    };

    const handleUserDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/admin-users/${userId}/`);
            setUsers(prev => prev.filter(u => u.id !== userId));
            fetchStats();
        } catch (e) {
            console.error("Failed to delete user", e);
            alert("Failed to delete user");
        }
    };

    // Open Product Modal (Add or Edit)
    const openProductModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                name: product.name,
                item_code: product.item_code || '',
                category_id: product.category?.id || '',
                fabric: product.fabric || '',
                price: product.price,
                discount_price: product.discount_price || '',
                stock: product.stock,
                description: product.description || '',
                is_featured: product.is_featured || false,
                is_active: product.is_active !== false
            });
            // Fetch full details to get images and video
            api.get(`/products/${product.id}/`).then(res => {
                setProductImages(res.data.images || []);
                setVideoPreview(res.data.video || null);
            });
            setSelectedLocalImages([]);
            setVideoFile(null);
        } else {
            setEditingProduct(null);
            setProductForm({
                name: '',
                item_code: '',
                category_id: categories[0]?.id || '',
                fabric: '',
                price: '',
                discount_price: '',
                stock: 0,
                description: '',
                is_featured: false,
                is_active: true
            });
            setProductImages([]);
            setSelectedLocalImages([]);
            setVideoFile(null);
            setVideoPreview(null);
        }
        setShowProductModal(true);
    };

    // Save Product (Create or Edit)
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...productForm,
                price: parseFloat(productForm.price),
                discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
                stock: parseInt(productForm.stock, 10)
            };

            let createdProduct = null;
            if (editingProduct) {
                const res = await api.put(`/products/${editingProduct.id}/`, data);
                createdProduct = res.data;
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data : p));
            } else {
                const res = await api.post('/products/', data);
                createdProduct = res.data;
                setProducts(prev => [res.data, ...prev]);
            }

            // Upload video if selected
            if (videoFile && createdProduct) {
                const formData = new FormData();
                formData.append('video', videoFile);
                try {
                    await api.patch(`/products/${createdProduct.id}/`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } catch (err) {
                    console.error("Failed to upload video file", err);
                }
            }

            // Upload selected images after product is created
            if (selectedLocalImages.length > 0 && createdProduct) {
                for (const img of selectedLocalImages) {
                    const formData = new FormData();
                    formData.append('product', createdProduct.id);
                    formData.append('image', img.file);
                    formData.append('is_main', img.isMain ? 'true' : 'false');
                    formData.append('alt_text', createdProduct.name);

                    try {
                        await api.post('/products/images/', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    } catch (imageErr) {
                        console.error('Failed to upload image during creation', imageErr);
                    }
                }
            }

            setShowProductModal(false);
            fetchStats();
            fetchProducts();
        } catch (e) {
            console.error("Failed to save product", e);
            alert(e.response?.data ? Object.values(e.response.data).flat().join(', ') : "Failed to save product");
        }
    };

    // Delete Product
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${productId}/`);
            setProducts(prev => prev.filter(p => p.id !== productId));
            fetchStats();
        } catch (e) {
            console.error("Failed to delete product", e);
            alert("Failed to delete product");
        }
    };

    // Product Image Upload
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (editingProduct) {
            for (const file of files) {
                const formData = new FormData();
                formData.append('product', editingProduct.id);
                formData.append('image', file);
                formData.append('is_main', (productImages.length === 0 && selectedLocalImages.length === 0) ? 'true' : 'false');
                formData.append('alt_text', editingProduct.name);

                try {
                    const res = await api.post('/products/images/', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    setProductImages(prev => [...prev, res.data]);
                } catch (err) {
                    console.error("Failed to upload image", err);
                }
            }
            fetchProducts();
        } else {
            const newImages = files.map((file, idx) => ({
                file,
                previewUrl: URL.createObjectURL(file),
                isMain: (selectedLocalImages.length === 0 && idx === 0)
            }));
            setSelectedLocalImages(prev => [...prev, ...newImages]);
        }
    };

    // Toggle Main Product Image
    const handleSetMainImage = async (imageId) => {
        if (!editingProduct) return;
        try {
            await api.patch(`/products/images/${imageId}/`, { is_main: true });
            // Refetch images to update UI
            const res = await api.get(`/products/${editingProduct.id}/`);
            setProductImages(res.data.images || []);
            fetchProducts();
        } catch (err) {
            console.error("Failed to set main image", err);
        }
    };

    // Delete Product Image
    const handleDeleteImage = async (imageId) => {
        try {
            await api.delete(`/products/images/${imageId}/`);
            setProductImages(prev => prev.filter(img => img.id !== imageId));
            fetchProducts();
        } catch (err) {
            console.error("Failed to delete image", err);
        }
    };

    // Local Image Actions (for creation / additions before saving)
    const handleSetLocalMainImage = (index) => {
        setSelectedLocalImages(prev => prev.map((img, i) => ({
            ...img,
            isMain: i === index
        })));
    };

    const handleDeleteLocalImage = (index) => {
        setSelectedLocalImages(prev => {
            const filtered = prev.filter((_, i) => i !== index);
            if (prev[index]?.isMain && filtered.length > 0) {
                filtered[0].isMain = true;
            }
            return filtered;
        });
    };

    const getSalesChartData = () => {
        const salesByDate = {};
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            salesByDate[dateString] = 0;
            dates.push(dateString);
        }

        orders.forEach(order => {
            if (order.payment_status === 'Paid') {
                const orderDate = new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                if (orderDate in salesByDate) {
                    salesByDate[orderDate] += parseFloat(order.total_amount);
                }
            }
        });

        return dates.map(date => ({ date, amount: salesByDate[date] }));
    };

    const chartData = getSalesChartData();
    const maxAmount = Math.max(...chartData.map(d => d.amount), 5000);

    // SVG dimensions
    const svgW = 500;
    const svgH = 200;
    const paddingX = 40;
    const paddingY = 20;

    // Generate points
    const points = chartData.map((d, index) => {
        const x = paddingX + (index * (svgW - paddingX * 2)) / (chartData.length - 1);
        const y = svgH - paddingY - (d.amount / maxAmount) * (svgH - paddingY * 2);
        return { x, y, ...d };
    });

    const linePath = points.length > 0
        ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
        : '';

    const areaPath = points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${svgH - paddingY} L ${points[0].x} ${svgH - paddingY} Z`
        : '';

    // Filtered lists
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shipping_full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.user_email && order.user_email.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || order.order_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.item_code?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category?.slug === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const filteredUsers = users.filter(user => {
        return (
            user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone?.includes(searchQuery)
        );
    });

    const lowStockList = products.filter(p => p.stock < 5);

    return (
        <div className={s.dashboardContainer}>
            {/* Sidebar Navigation */}
            <aside className={s.sidebar}>
                <div className={s.logoArea}>
                    <img src="/assets/logo.jpg" alt="Aharya" className={s.logoImg} onError={(e) => { e.target.style.display = 'none' }} />
                    <div className={s.logoText}>
                        <span className={s.logoName}>Āhāryā Panel</span>
                        <span className={s.logoTag}>Superuser Dashboard</span>
                    </div>
                </div>

                <nav className={s.navMenu}>
                    <button
                        className={`${s.navItem} ${activeTab === 'overview' ? s.navItemActive : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <OverviewIcon /> Overview
                    </button>
                    <button
                        className={`${s.navItem} ${activeTab === 'orders' ? s.navItemActive : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <OrdersIcon /> Orders
                    </button>
                    <button
                        className={`${s.navItem} ${activeTab === 'products' ? s.navItemActive : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <ProductsIcon /> Products
                    </button>
                    <button
                        className={`${s.navItem} ${activeTab === 'users' ? s.navItemActive : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <UsersIcon /> Customers
                    </button>
                </nav>

                <div className={s.sidebarFooter}>
                    <button className={s.backBtn} onClick={() => setViewMode('shop')}>
                        <BackIcon /> Back to Storefront
                    </button>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className={s.mainContent}>
                <div className={s.headerRow}>
                    <div>
                        <h1 className={s.pageTitle}>
                            {activeTab === 'overview' && "Dashboard Overview"}
                            {activeTab === 'orders' && "Manage Sales Orders"}
                            {activeTab === 'products' && "Aharya Catalog Management"}
                            {activeTab === 'users' && "Registered Customer Accounts"}
                        </h1>
                    </div>

                    <div className={s.userInfo}>
                        <div className={s.userAvatar}>A</div>
                        <span>Administrator</span>
                    </div>
                </div>

                {/* Tab Specific Content */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stat Cards */}
                        <div className={s.statsGrid}>
                            <div className={`${s.statCard} ${s.statCardIncome}`}>
                                <div className={s.statInfo}>
                                    <span className={s.statLabel}>Total Income</span>
                                    <span className={s.statValue}>₹{parseFloat(stats.total_sales).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className={`${s.statIcon} ${s.incomeIcon}`}>₹</div>
                            </div>

                            <div className={`${s.statCard} ${s.statCardOrders}`}>
                                <div className={s.statInfo}>
                                    <span className={s.statLabel}>Total Orders</span>
                                    <span className={s.statValue}>{stats.total_orders}</span>
                                </div>
                                <div className={`${s.statIcon} ${s.ordersIcon}`}>
                                    <OrdersIcon />
                                </div>
                            </div>

                            <div className={`${s.statCard} ${s.statCardUsers}`}>
                                <div className={s.statInfo}>
                                    <span className={s.statLabel}>Total Customers</span>
                                    <span className={s.statValue}>{stats.total_users}</span>
                                </div>
                                <div className={`${s.statIcon} ${s.usersIcon}`}>
                                    <UsersIcon />
                                </div>
                            </div>

                            <div className={`${s.statCard} ${s.statCardStock}`}>
                                <div className={s.statInfo}>
                                    <span className={s.statLabel}>Low Stock Items</span>
                                    <span className={s.statValue}>{stats.low_stock_products}</span>
                                </div>
                                <div className={`${s.statIcon} ${s.stockIcon}`}>!</div>
                            </div>
                        </div>

                        {/* Grid of Chart & Alerts */}
                        <div className={s.contentGrid}>
                            <div className={s.glassCard}>
                                <div className={s.cardHeader}>
                                    <h3 className={s.cardTitle}>Sales Performance (Last 7 Days)</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Paid orders total</span>
                                </div>

                                <div className={s.chartContainer}>
                                    <svg className={s.chartSvg} viewBox={`0 0 ${svgW} ${svgH}`}>
                                        <defs>
                                            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#8a2be2" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#8a2be2" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Horizontal gridlines */}
                                        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                                            const y = paddingY + r * (svgH - paddingY * 2);
                                            return (
                                                <g key={i}>
                                                    <line className={s.chartGridline} x1={paddingX} y1={y} x2={svgW - paddingX} y2={y} />
                                                    <text x={paddingX - 10} y={y + 4} fill="#64748b" fontSize="8" textAnchor="end">
                                                        ₹{Math.round((1 - r) * maxAmount)}
                                                    </text>
                                                </g>
                                            );
                                        })}

                                        {/* Gradient Area under line */}
                                        {points.length > 0 && <path className={s.chartArea} d={areaPath} />}

                                        {/* The Line */}
                                        {points.length > 0 && <path className={s.chartLine} d={linePath} />}

                                        {/* Interactivity points */}
                                        {points.map((p, i) => (
                                            <g key={i}>
                                                <circle className={s.chartDot} cx={p.x} cy={p.y} r="5" />
                                                <text className={s.chartText} x={p.x} y={svgH - 4}>
                                                    {p.date}
                                                </text>
                                                {/* Hover Amount Tooltip display */}
                                                <text x={p.x} y={p.y - 10} fill="#ffffff" fontSize="9" fontWeight="600" textAnchor="middle">
                                                    {p.amount > 0 ? `₹${p.amount}` : ''}
                                                </text>
                                            </g>
                                        ))}
                                    </svg>
                                </div>
                            </div>

                            {/* Low Stock Alerts card */}
                            <div className={s.glassCard}>
                                <div className={s.cardHeader}>
                                    <h3 className={s.cardTitle}>Low Stock Warnings</h3>
                                </div>
                                <div className={s.alertsList}>
                                    {lowStockList.length === 0 ? (
                                        <div className={s.emptyAlert}>All product stock levels are stable.</div>
                                    ) : (
                                        lowStockList.slice(0, 4).map(product => (
                                            <div className={s.alertItem} key={product.id}>
                                                <div className={s.alertContent}>
                                                    <div style={{ fontWeight: '500' }}>{product.name}</div>
                                                </div>
                                                <div className={s.alertMeta}>Stock: {product.stock}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders table */}
                        <div className={s.glassCard}>
                            <div className={s.cardHeader}>
                                <h3 className={s.cardTitle}>Recent Customer Orders</h3>
                                <button className={s.primaryBtn} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('orders')}>
                                    View All
                                </button>
                            </div>
                            <div className={s.tableContainer}>
                                <table className={s.adminTable}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Total Amount</th>
                                            <th>Payment Status</th>
                                            <th>Order Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map(order => (
                                            <tr key={order.id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order.id.slice(0, 8)}...</td>
                                                <td>{order.shipping_full_name}</td>
                                                <td style={{ fontWeight: '600' }}>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                                <td>
                                                    <span className={`${s.statusPill} ${order.payment_status === 'Paid' ? s.statusPaid : order.payment_status === 'Pending' ? s.statusPending : s.statusFailed}`}>
                                                        {order.payment_status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`${s.statusPill} ${order.order_status === 'Delivered' ? s.statusDelivered :
                                                            order.order_status === 'Shipped' ? s.statusShipped :
                                                                order.order_status === 'Pending' ? s.statusPending :
                                                                    order.order_status === 'Cancelled' ? s.statusCancelled :
                                                                        s.statusPaid
                                                        }`}>
                                                        {order.order_status}
                                                    </span>
                                                </td>
                                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'orders' && (
                    <div className={s.glassCard}>
                        <div className={s.controlsRow}>
                            <div className={s.searchWrapper}>
                                <span className={s.searchIcon}><SearchIcon /></span>
                                <input
                                    type="text"
                                    placeholder="Search order ID or customer..."
                                    className={s.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className={s.filterGroup}>
                                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Filter Status:</span>
                                <select
                                    className={s.filterSelect}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid / Packed</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className={s.tableContainer}>
                            <table className={s.adminTable}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer Name</th>
                                        <th>Subtotal</th>
                                        <th>Total</th>
                                        <th>Payment</th>
                                        <th>Fulfillment</th>
                                        <th>Order Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order.id.slice(0, 16)}...</td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '500' }}>{order.shipping_full_name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.user_email}</span>
                                                </div>
                                            </td>
                                            <td>₹{parseFloat(order.subtotal).toFixed(2)}</td>
                                            <td style={{ fontWeight: '600' }}>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                            <td>
                                                <select
                                                    className={s.filterSelect}
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', height: 'auto' }}
                                                    value={order.payment_status}
                                                    onChange={(e) => handleOrderStatusUpdate(order.id, { payment_status: e.target.value })}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Paid">Paid</option>
                                                    <option value="Failed">Failed</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className={s.filterSelect}
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', height: 'auto' }}
                                                    value={order.order_status}
                                                    onChange={(e) => handleOrderStatusUpdate(order.id, { order_status: e.target.value })}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Paid">Paid / Packed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button className={s.primaryBtn} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>
                                                    Items
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                No orders match the search filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className={s.glassCard}>
                        <div className={s.controlsRow}>
                            <div className={s.searchWrapper}>
                                <span className={s.searchIcon}><SearchIcon /></span>
                                <input
                                    type="text"
                                    placeholder="Search catalog by name, item code..."
                                    className={s.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className={s.filterGroup}>
                                <select
                                    className={s.filterSelect}
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.slug}>{c.name}</option>
                                    ))}
                                </select>

                                <button className={s.primaryBtn} onClick={() => openProductModal(null)}>
                                    <PlusIcon /> Add Product
                                </button>
                            </div>
                        </div>

                        <div className={s.tableContainer}>
                            <table className={s.adminTable}>
                                <thead>
                                    <tr>
                                        <th>Product Details</th>
                                        <th>Item Code</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock Level</th>
                                        <th>Status</th>
                                        <th>Featured</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className={s.productCell}>
                                                    <img src={product.main_image || "/assets/placeholder.jpg"} alt="" className={s.productThumb} onError={(e) => { e.target.src = '/assets/logo.jpg' }} />
                                                    <div className={s.productNameCell}>
                                                        <span style={{ fontWeight: '500' }}>{product.name}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{product.fabric}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: 'monospace' }}>{product.item_code || 'N/A'}</td>
                                            <td>{product.category?.name || 'N/A'}</td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '600' }}>₹{parseFloat(product.price).toFixed(2)}</span>
                                                    {product.discount_price && <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#ef4444' }}>₹{parseFloat(product.discount_price).toFixed(2)}</span>}
                                                </div>
                                            </td>
                                            <td>
                                                {/* Inline Stock Counter */}
                                                <div className={s.stockContainer}>
                                                    <button className={s.stockBtn} onClick={() => handleQuickStockChange(product, product.stock - 1)}>-</button>
                                                    <span className={s.stockVal} style={{ color: product.stock < 5 ? '#f59e0b' : '#10b981' }}>{product.stock}</span>
                                                    <button className={s.stockBtn} onClick={() => handleQuickStockChange(product, product.stock + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`${s.statusPill} ${product.is_active !== false ? s.statusPaid : s.statusCancelled}`}>
                                                    {product.is_active !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${s.statusPill} ${product.is_featured ? s.statusShipped : s.statusCancelled}`}>
                                                    {product.is_featured ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={s.actionsCell}>
                                                    <button className={s.actionBtn} title="Edit Product" onClick={() => openProductModal(product)}>
                                                        <EditIcon />
                                                    </button>
                                                    <button className={`${s.actionBtn} ${s.actionBtnDelete}`} title="Delete Product" onClick={() => handleDeleteProduct(product.id)}>
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                No products found in the catalog.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className={s.glassCard}>
                        <div className={s.controlsRow}>
                            <div className={s.searchWrapper}>
                                <span className={s.searchIcon}><SearchIcon /></span>
                                <input
                                    type="text"
                                    placeholder="Search customers by name or email..."
                                    className={s.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={s.tableContainer}>
                            <table className={s.adminTable}>
                                <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Email Address</th>
                                        <th>Phone</th>
                                        <th>Joined Date</th>
                                        <th>Staff Privilege</th>
                                        <th>Account Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td style={{ fontWeight: '500' }}>{user.full_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || 'N/A'}</td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <div
                                                    className={`${s.toggleLabel} ${user.is_staff ? s.toggleStaff : ''}`}
                                                    onClick={() => handleUserToggle(user.id, 'is_staff', user.is_staff)}
                                                >
                                                    <span className={s.toggleSwitch}></span>
                                                    <span>{user.is_staff ? 'Superuser' : 'Customer'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={`${s.toggleLabel} ${user.is_active ? s.toggleActive : ''}`}
                                                    onClick={() => handleUserToggle(user.id, 'is_active', user.is_active)}
                                                >
                                                    <span className={s.toggleSwitch}></span>
                                                    <span>{user.is_active ? 'Active' : 'Suspended'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button className={`${s.actionBtn} ${s.actionBtnDelete}`} onClick={() => handleUserDelete(user.id)}>
                                                    <TrashIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                No customers found matching search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* --- Modals & Overlays --- */}

            {/* Orders Item details overlay */}
            <AnimatePresence>
                {showOrderModal && selectedOrder && (
                    <div className={s.modalOverlay} onClick={() => setShowOrderModal(false)}>
                        <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={s.modalHeader}>
                                <h3 className={s.modalTitle}>Order Breakdown: {selectedOrder.id.slice(0, 16)}...</h3>
                                <button className={s.modalClose} onClick={() => setShowOrderModal(false)}><CloseIcon /></button>
                            </div>

                            <div className={s.modalBody}>
                                {/* Shipping info */}
                                <div className={s.orderDetailCard}>
                                    <h4 className={s.infoTitle}>Shipping Particulars</h4>
                                    <div className={s.infoGrid}>
                                        <div>
                                            <div className={s.infoLabel}>Full Name:</div>
                                            <div className={s.infoVal}>{selectedOrder.shipping_full_name}</div>
                                        </div>
                                        <div>
                                            <div className={s.infoLabel}>Phone:</div>
                                            <div className={s.infoVal}>{selectedOrder.shipping_phone}</div>
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <div className={s.infoLabel}>Delivery Address:</div>
                                            <div className={s.infoVal}>
                                                {selectedOrder.shipping_address}, {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_postal_code}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className={s.orderDetailCard}>
                                    <h4 className={s.infoTitle}>Ordered Garments</h4>
                                    <div className={s.orderedItemsList}>
                                        {selectedOrder.items?.map(item => (
                                            <div className={s.orderedItemRow} key={item.id}>
                                                <div className={s.itemMain}>
                                                    <span className={s.itemName}>{item.product_name}</span>
                                                    <span className={s.itemQtyPrice}>{item.quantity} x ₹{parseFloat(item.price).toFixed(2)}</span>
                                                </div>
                                                <span className={s.itemTotal}>₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem' }}>
                                    <span style={{ color: '#94a3b8' }}>Transaction Amount:</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#c8a84b' }}>₹{parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className={s.modalFooter}>
                                <button className={s.secondaryBtn} onClick={() => setShowOrderModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add / Edit Product Modal */}
            <AnimatePresence>
                {showProductModal && (
                    <div className={s.modalOverlay} onClick={() => setShowProductModal(false)}>
                        <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={s.modalHeader}>
                                <h3 className={s.modalTitle}>{editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Garment to Catalog"}</h3>
                                <button className={s.modalClose} onClick={() => setShowProductModal(false)}><CloseIcon /></button>
                            </div>

                            <form onSubmit={handleSaveProduct}>
                                <div className={s.modalBody}>
                                    <div className={s.formGrid}>
                                        <div className={`${s.formGroup} ${s.formGroupFull}`}>
                                            <label className={s.formLabel}>Product Name *</label>
                                            <input
                                                type="text"
                                                required
                                                className={s.formInput}
                                                value={productForm.name}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                                            />
                                        </div>

                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Item Code *</label>
                                            <input
                                                type="text"
                                                required
                                                className={s.formInput}
                                                value={productForm.item_code}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, item_code: e.target.value }))}
                                            />
                                        </div>

                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Fabric Type *</label>
                                            <input
                                                type="text"
                                                required
                                                className={s.formInput}
                                                placeholder="e.g. Silk, Banarasi, Cotton"
                                                value={productForm.fabric}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, fabric: e.target.value }))}
                                            />
                                        </div>

                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Category *</label>
                                            <select
                                                className={s.formInput}
                                                value={productForm.category_id}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Price (INR) *</label>
                                            <input
                                                type="number"
                                                required
                                                step="0.01"
                                                className={s.formInput}
                                                value={productForm.price}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                                            />
                                        </div>

                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Discounted Price (INR)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className={s.formInput}
                                                value={productForm.discount_price}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, discount_price: e.target.value }))}
                                            />
                                        </div>

                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Available Stock *</label>
                                            <input
                                                type="number"
                                                required
                                                className={s.formInput}
                                                value={productForm.stock}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                                            />
                                        </div>

                                        <div className={s.formGroup} style={{ justifyContent: 'center' }}>
                                            <label className={s.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    className={s.checkboxInput}
                                                    checked={productForm.is_featured}
                                                    onChange={(e) => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                                                />
                                                Featured Product
                                            </label>
                                            <label className={s.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    className={s.checkboxInput}
                                                    checked={productForm.is_active}
                                                    onChange={(e) => setProductForm(prev => ({ ...prev, is_active: e.target.checked }))}
                                                />
                                                Product Active (Visible to customer)
                                            </label>
                                        </div>

                                        <div className={`${s.formGroup} ${s.formGroupFull}`}>
                                            <label className={s.formLabel}>Product Description *</label>
                                            <textarea
                                                required
                                                className={`${s.formInput} ${s.formTextarea}`}
                                                value={productForm.description}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Product Image Manager */}
                                    <div className={s.imagesSection}>
                                        <h4 className={s.formLabel} style={{ marginBottom: '0.75rem' }}>Product Photos</h4>

                                        <div className={s.imagesGrid}>
                                            {/* Backend-saved images (Edit Mode) */}
                                            {editingProduct && productImages.map(img => (
                                                <div className={s.imgWrapper} key={img.id}>
                                                    <img src={img.image} alt="" className={s.gridImg} />
                                                    {img.is_main && <span className={s.mainBadge}>Main</span>}
                                                    <div className={s.imgOverlay}>
                                                        {!img.is_main && (
                                                            <button type="button" className={`${s.imgOverlayBtn} ${s.imgOverlayBtnMain}`} title="Set as Main" onClick={() => handleSetMainImage(img.id)}>
                                                                ✓
                                                            </button>
                                                        )}
                                                        <button type="button" className={s.imgOverlayBtn} title="Delete Image" onClick={() => handleDeleteImage(img.id)}>
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Local selected images (Add / Edit Mode before save) */}
                                            {selectedLocalImages.map((img, idx) => (
                                                <div className={s.imgWrapper} key={idx}>
                                                    <img src={img.previewUrl} alt="" className={s.gridImg} />
                                                    {img.isMain && <span className={s.mainBadge}>Main</span>}
                                                    <div className={s.imgOverlay}>
                                                        {!img.isMain && (
                                                            <button type="button" className={`${s.imgOverlayBtn} ${s.imgOverlayBtnMain}`} title="Set as Main" onClick={() => handleSetLocalMainImage(idx)}>
                                                                ✓
                                                            </button>
                                                        )}
                                                        <button type="button" className={s.imgOverlayBtn} title="Remove Image" onClick={() => handleDeleteLocalImage(idx)}>
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <label className={s.uploadWrapper}>
                                                <CameraIcon />
                                                <span className={s.uploadText}>Upload Photos</span>
                                                <input type="file" accept="image/*" multiple className={s.uploadInput} onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Video Section */}
                                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                        <h4 className={s.formLabel} style={{ marginBottom: '0.75rem' }}>Product Video Showcase (Optional)</h4>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            {videoPreview ? (
                                                <div style={{ position: 'relative', width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                                                    <video src={videoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted controls />
                                                    <button
                                                        type="button"
                                                        className={s.imgOverlayBtn}
                                                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)' }}
                                                        onClick={handleRemoveVideo}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className={s.uploadWrapper} style={{ width: '150px', height: '100px' }}>
                                                    <span style={{ fontSize: '1.5rem' }}>📹</span>
                                                    <span className={s.uploadText}>Local Video</span>
                                                    <input type="file" accept="video/*" className={s.uploadInput} onChange={handleVideoSelect} />
                                                </label>
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                                                    Upload a video showing the drape, shine, or pattern details of this saree.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className={s.modalFooter}>
                                    <button type="button" className={s.secondaryBtn} onClick={() => setShowProductModal(false)}>Cancel</button>
                                    <button type="submit" className={s.primaryBtn}>Save Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
