// ============================================================
// AHARYA – Footer Component
// ============================================================
import s from './Footer.module.css';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const PinterestIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.footerGrid}>
          {/* Brand */}
          <div className={s.brandCol}>
            <div className={s.footerLogo}>
              <img src="/assets/logo.jpg" alt="Aharya" className={s.footerLogoImg} />
              <span className={s.footerLogoName}>Āhāryā</span>
            </div>
            <p className={s.footerDesc}>
              The Indian Diva's Closet. Celebrating the timeless art of handcrafted sarees from master weavers across India.
            </p>
            <div className={s.socialRow}>
              <button className={s.socialBtn} aria-label="Instagram"><InstagramIcon /></button>
              <button className={s.socialBtn} aria-label="Pinterest"><PinterestIcon /></button>
              <button className={s.socialBtn} aria-label="Facebook"><FacebookIcon /></button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <div className={s.colTitle}>Shop</div>
            <ul className={s.colLinks}>
              {["New Arrivals", "Wedding Collection", "Silk Sarees", "Designer Sarees", "Daily Wear", "Sale"].map(l => (
                <li key={l}><a>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <div className={s.colTitle}>Information</div>
            <ul className={s.colLinks}>
              {["About Aharya", "Our Weavers", "Blog", "Size Guide", "Care Instructions", "Contact Us"].map(l => (
                <li key={l}><a>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <div className={s.newsletterTitle}>Stay in Style</div>
            <p className={s.newsletterText}>
              Subscribe for exclusive collections, artisan stories, and seasonal offers.
            </p>
            <form className={s.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input
                className={s.newsletterInput}
                type="email"
                placeholder="your@email.com"
                id="footer-newsletter-input"
              />
              <button className={s.newsletterBtn} type="submit" id="footer-newsletter-btn">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className={s.footerBottom}>
          <p className={s.copyright}>
            © {new Date().getFullYear()} Āhāryā. All rights reserved. Made with ♥ in India.
          </p>
          <div className={s.bottomLinks}>
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
            <a>Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

