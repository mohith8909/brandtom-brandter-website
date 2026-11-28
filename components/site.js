/*
 * One place for the site's navigation and contact details, shared by the header,
 * the phone menu, the footer and the floating WhatsApp button.
 */

export const CONTACT = {
    phone: '+91 95850 50047',
    tel: 'tel:+919585050047',
    email: 'contactus@brandtomandbrandter.com',
    whatsapp: 'https://wa.me/919585050047?text=Hi%20Brandtom%20%26%20Brandter%2C%20I%20would%20like%20to%20discuss%20a%20project.',
    address: '2 A, M P Avenue, Abbusali St, Saligramam, Chennai, Tamil Nadu 600093',
    company: 'Brandtom & Brandter India Pvt. Ltd.',
};

export const SOCIALS = [
    { label: 'Instagram', href: 'https://www.instagram.com/brandtom_brandter?igsh=MWgzNzEyYTN5Nmxqbg==' },
    { label: 'Facebook', href: 'https://www.facebook.com/share/17J73h24vn/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/brandom-brandter/' },
];

// Main pages. "page" is the path that marks the link as the current page.
// About is a section of the home page for now.
export const PAGES = [
    { href: '/', label: 'Home', page: '/' },
    { href: '/#about', label: 'About Us' },
    { href: '/services', label: 'Our Services', page: '/services', hasServices: true },
    { href: '/contact-us', label: 'Contact Us', page: '/contact-us' },
];

// The eight services, in the same order as the Services page. The slug is the id of
// the service's card there, so /services#slug opens it.
export const SERVICES = [
    { slug: 'creative-campaigns', name: 'Creative Campaigns', blurb: 'Ideas that get noticed', color: 'var(--c-coral)' },
    { slug: 'brand-strategy', name: 'Brand Strategy & Ideation', blurb: 'Positioning with purpose', color: 'var(--c-blue)' },
    { slug: 'content-copywriting', name: 'Content & Communication', blurb: 'A voice people remember', color: 'var(--c-magenta)' },
    { slug: 'digital-marketing', name: 'Digital Marketing', blurb: 'Reach, measured', color: 'var(--c-royal)' },
    { slug: 'graphic-design', name: 'Graphic Designing', blurb: 'Visuals with impact', color: 'var(--c-plum)' },
    { slug: 'content-production', name: 'Content Production', blurb: 'Ad films, shoots, social', color: 'var(--c-coral)' },
    { slug: 'brand-communication', name: 'Brand Communication', blurb: 'Values into stories', color: 'var(--c-blue)' },
    { slug: 'influencer-marketing', name: 'Influencer Marketing', blurb: 'Trusted voices, real growth', color: 'var(--c-lime)' },
];

export const serviceHref = (slug) => `/services#${slug}`;
