// ─────────────────────────────────────────────────────────────
//  AVD Spark Decor — edit business details HERE (one place only)
// ─────────────────────────────────────────────────────────────
const env = import.meta.env

export const SITE = {
  name: 'AVD Spark Decor',
  suffix: '& Event Management',
  city: 'Krishnapuram',            // ← change if your location is different
  region: 'Tamil Nadu',
  phone: '+91 93842 17626',
  whatsapp: env.VITE_WHATSAPP || '919384217626',   // country code + number, no "+"
  hours: 'Mon – Sun, 9am – 8pm',
  instagramHandle: (env.VITE_INSTAGRAM_HANDLE || '').replace(/^@/, ''),   // e.g. avdsparkdecor (hidden until set)
}
SITE.address = `${SITE.city}, ${SITE.region}`
SITE.instagram = SITE.instagramHandle ? `https://instagram.com/${SITE.instagramHandle}` : ''
SITE.instagramDM = SITE.instagramHandle ? `https://ig.me/m/${SITE.instagramHandle}` : ''
SITE.tel = 'tel:+' + SITE.whatsapp
SITE.mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`
SITE.mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`

export const waLink = (text = 'Hi! I want to book a decoration for my event.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`

export const CATEGORIES = [
  { name: 'Wedding', icon: '💍', desc: 'Timeless elegance' },
  { name: 'Birthday', icon: '🎂', desc: 'Colourful celebrations' },
  { name: 'Baby Shower', icon: '🍼', desc: 'Sweet beginnings' },
  { name: 'Puberty Function', icon: '🌸', desc: 'A sacred milestone' },
  { name: 'Surprise Party', icon: '🎉', desc: 'Magical moments' },
  { name: 'Engagement', icon: '👫', desc: 'Love in bloom' },
]
export const EVENT_TYPES = [...CATEGORIES.map(c => c.name), 'Other']

export const HIGHLIGHTS = [
  'Custom Themes', 'Stage & Backdrops', 'Balloon Decor', 'Floral Arrangements',
  'Lighting & Effects', 'Entrance Arches', 'Photo Corners', 'Open 7 Days',
]

export const WHY_US = [
  { icon: '🎨', title: 'Custom Designs', desc: 'Every event is unique. We create designs tailored exclusively for you.' },
  { icon: '⭐', title: 'Premium Quality', desc: 'Only the finest flowers, fabrics and materials for every decoration.' },
  { icon: '⏱️', title: 'On-Time Setup', desc: 'We respect your timeline and deliver flawless setups every time.' },
  { icon: '💬', title: 'Personal Support', desc: 'Dedicated consultation from design to execution with your vision at heart.' },
]

export const STEPS = [
  { n: '01', title: 'Choose a design', desc: 'Browse the gallery and save the looks you love.' },
  { n: '02', title: 'Send your request', desc: 'Call, WhatsApp or message us on Instagram with your date and venue.' },
  { n: '03', title: 'Get your plan', desc: 'We call you with a customised plan and quote.' },
  { n: '04', title: 'Enjoy your event', desc: 'Our team sets everything up before your guests arrive.' },
]

// Sample packages — edit the lists freely (no prices are shown on purpose)
export const PACKAGES = [
  { name: 'Classic', tag: 'Simple & elegant', items: ['Themed backdrop', 'Balloon garland', 'Table decor', 'Name board'] },
  { name: 'Premium', tag: 'Most popular', featured: true, items: ['Designer stage', 'Floral & balloon mix', 'Entrance arch', 'Photo corner', 'Lighting'] },
  { name: 'Royal', tag: 'Grand occasions', items: ['Full venue styling', 'Custom stage & props', 'Premium florals', 'Special effects', 'Dedicated team'] },
]

// Replace with your real customer reviews when you have them
export const TESTIMONIALS = [
  { name: 'Priya Rajan', event: 'Wedding', text: 'AVD Spark Decor transformed our wedding hall into a fairy tale. Every detail was perfect, and the floral arrangements were breathtaking!' },
  { name: 'Kavitha S.', event: 'Baby Shower', text: 'I was completely surprised by how beautiful everything looked. The team was professional and delivered beyond expectations.' },
  { name: 'Arun Kumar', event: 'Birthday', text: "My son's birthday party was absolutely magical. The balloon decorations and theme setup were exactly what we imagined!" },
]

export const FAQ = [
  { q: 'How do I book a decoration?', a: 'Bookings are taken by phone call, WhatsApp or Instagram message. Share your date, venue and the design you like, and we will confirm the details with you.' },
  { q: 'How early should I book?', a: 'As early as possible — especially for wedding and festival season. Send us your date and we will check availability.' },
  { q: 'Can you create a custom theme?', a: 'Yes. Share a photo, colour palette or idea and we will design a setup around it.' },
  { q: 'Which areas do you serve?', a: `We are based in ${SITE.address}. Share your venue location and we will confirm if we can cover it.` },
  { q: 'How is the price decided?', a: 'It depends on theme, stage size, materials and venue. Tell us your budget and we will suggest the best options.' },
]
