import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from 'flowbite-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from 'lucide-react';

const AppFooter: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(t('footer.newsletter.successMessage', { email }));
      setEmail('');
    }
  };

  return (
    <Footer className="bg-gray-900 text-white rounded-none shadow-none border-t border-gray-800">
      <div className="w-full">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info & Newsletter */}
            <div className="space-y-6">
              <FooterBrand
                href="/"
                name="Smart S3r"
                className="text-white hover:text-blue-400"
              />
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('footer.description')}
              </p>

              {/* Newsletter Subscription */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  {t('footer.newsletter.title')}
                </h4>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t('footer.newsletter.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-xs text-gray-400">
                  {t('footer.newsletter.description')}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <FooterTitle title={t('footer.quickLinks.title')} className="text-white" />
              <FooterLinkGroup col className="space-y-3">
                <FooterLink
                  as={Link}
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.quickLinks.about')}
                </FooterLink>
                <FooterLink
                  as={Link}
                  to="/contact"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.quickLinks.contact')}
                </FooterLink>
                <FooterLink
                  as={Link}
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.quickLinks.privacy')}
                </FooterLink>
                <FooterLink
                  as={Link}
                  to="/terms"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.quickLinks.terms')}
                </FooterLink>
                <FooterLink
                  as={Link}
                  to="/faq"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.quickLinks.faq')}
                </FooterLink>
              </FooterLinkGroup>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <FooterTitle title={t('footer.customerService.title')} className="text-white" />
              <FooterLinkGroup col className="space-y-3">
                <FooterLink
                  as={Link}
                  to="/products"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.customerService.products')}
                </FooterLink>
                <FooterLink
                  as={Link}
                  to="/categories"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.customerService.categories')}
                </FooterLink>
                <FooterLink
                  as={Link}
                  to="/wishlist"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.customerService.wishlist')}
                </FooterLink>
                <FooterLink
                  as={Link}
                  to="/cart"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  {t('footer.customerService.cart')}
                </FooterLink>
              </FooterLinkGroup>
            </div>

            {/* Contact Info & Social Media */}
            <div className="space-y-4">
              <FooterTitle title={t('footer.contact.title')} className="text-white" />

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-sm">{t('footer.contact.location')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-sm">{t('footer.contact.phone')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-sm">{t('footer.contact.email')}</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  {t('footer.social.title')}
                </h4>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-500 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-700 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <FooterDivider className="my-8 border-gray-700" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <FooterCopyright
              by="Smart S3r™"
              year={2026}
              className="text-gray-400 text-sm"
            />
            <div className="flex flex-wrap gap-6 text-sm">
              <FooterLink
                as={Link}
                to="/privacy-policy"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t('footer.legal.privacy')}
              </FooterLink>
              <FooterLink
                as={Link}
                to="/terms"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t('footer.legal.terms')}
              </FooterLink>
              <FooterLink
                as={Link}
                to="/cookies"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t('footer.legal.cookies')}
              </FooterLink>
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export { AppFooter as Footer };
