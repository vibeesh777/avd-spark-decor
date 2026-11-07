// ─────────────────────────────────────────────────────────────
//  AVD Spark Decor — edit business details HERE (one place only)
// ─────────────────────────────────────────────────────────────
const env = import.meta.env

export const SITE = {
  name: 'AVD Spark Decor',
  suffix: '& Event Management',
  tagline: 'Creating & Lighting the Celebrations of Your Family',
  city: 'Krishnapuram, Perambalur',
  region: 'Tamil Nadu, India',
  // Orders: WhatsApp on ALL three numbers. Phone calls (emergency only): numbers 2 and 3.
  phones: [
    { label: '95970 66343', number: '919597066343', call: false, main: true },
    { label: '93842 17626', number: '919384217626', call: true },
    { label: '96297 22560', number: '919629722560', call: true },
  ],
  hours: 'Mon – Sun, 9am – 8pm',
  instagramHandle: (env.VITE_INSTAGRAM_HANDLE || 'avd_sparkdecor').replace(/^@/, ''),   // e.g. avdsparkdecor (hidden until set)
}
SITE.address = `${SITE.city}, ${SITE.region}`
SITE.instagram = SITE.instagramHandle ? `https://instagram.com/${SITE.instagramHandle}` : ''
SITE.instagramDM = SITE.instagramHandle ? `https://ig.me/m/${SITE.instagramHandle}` : ''
SITE.whatsapp = SITE.phones[0].number                       // main number for pre-filled links
SITE.callPhones = SITE.phones.filter(p => p.call)
SITE.phone = '+91 ' + SITE.callPhones[0].label
SITE.tel = 'tel:+' + SITE.callPhones[0].number
SITE.mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`
SITE.mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`

export const waLink = (text = 'Hi! I want to book a decoration for my event.', number = SITE.whatsapp) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`

export const CATEGORIES = [
  { name: 'Wedding', icon: '💍', desc: 'Timeless elegance' },
  { name: 'Birthday', icon: '🎂', desc: 'Colourful celebrations' },
  { name: 'Baby Shower', icon: '🍼', desc: 'Sweet beginnings' },
  { name: 'Puberty Function', icon: '🌸', desc: 'A sacred milestone' },
  { name: 'Surprise Party', icon: '🎉', desc: 'Magical moments' },
  { name: 'Engagement', icon: '👫', desc: 'Love in bloom' },
]
// Photo sections for services (admin can upload photos to these too)
export const SERVICE_CATEGORIES = ['DJ Setup', 'Teddy Dancers', 'Paper Spray']
export const ALL_CATEGORIES = [...CATEGORIES.map(c => c.name), ...SERVICE_CATEGORIES]

export const HIGHLIGHTS = [
  'Custom Themes', 'Stage & Backdrops', 'Balloon Decor', 'DJ Music Setup',
  'Teddy Dancers', 'Paper Spray Machines', 'Smoke Effects', 'Photography & Videography',
  'Catering', 'Open 7 Days',
]

// ── Extra services (from the AVD flyers) ──
export const FEATURE_SERVICES = [
  { id: 'dj', icon: '🎧', title: 'DJ Music Setup', img: '/services/dj.jpg',
    desc: 'Sound, lights and a live DJ vibe for your reception, birthday or surprise party — the dance floor stays full.' },
  { id: 'teddy', icon: '🧸', title: 'Teddy Dancers', img: '/services/teddy-group.jpg',
    desc: 'Giant Panda, Gorilla and Blue Fox mascot costumes that welcome guests, dance and make every photo unforgettable.' },
  { id: 'spray', icon: '🎊', title: 'Paper Spray Machines', img: '/services/confetti-gun.jpg',
    desc: 'Confetti guns, cannons and LED smoke machines for grand entries, couple walks and cake-cutting moments.' },
]

export const TEDDY_PLANS = [
  { count: 1, price: '₹3,500', hours: '2 hours' },
  { count: 2, price: '₹6,000', hours: '2 hours', best: true },
  { count: 3, price: '₹8,000', hours: '2 hours' },
]
export const MASCOTS = ['Panda', 'Gorilla', 'Blue Fox']

export const MACHINES = [
  { name: 'Confetti Gun', img: '/services/confetti-gun.jpg', desc: 'Create a grand welcome with stunning confetti effects!' },
  { name: 'LED Smoke Machine', img: '/services/led-smoke.jpg', desc: 'Bright lights + colour smoke for a vibrant look!' },
  { name: 'Confetti Cannon', img: '/services/confetti-cannon.jpg', desc: 'Full energy & fun with confetti showers!' },
]

export const PERFECT_FOR = ['🎂 Birthday Parties', '💍 Weddings', '🍼 Baby Shower', '🏠 House Inauguration', '🎉 Surprise Parties', '🎭 All Kinds of Events']

export const A_TO_Z = [
  'Wedding & Reception Decor', 'Baby Shower Decor', 'Birthday Events', 'Surprise Party', 'Pre-Wedding Shoot',
  'Manjal Neerattu Vizha Decor', 'Kaathukuthu Ceremony Decor', 'DJ Music Setup',
  'Photography & Videography', 'Catering Service', 'Traditional Welcome Dance', 'Smoke Effects', 'Beeda Stall',
  'Car Decor & AVD Car Travels', 'Ice Cream Stall', 'Traditional Chenda Melam',
  'Thappattam (Male & Female Professional Artists)', 'Cultural & Folk Dance Programs',
  'Male & Female Welcome Artists', 'Popcorn Stall', 'Cotton Candy Stall', 'And much more…',
]

export const VISION = 'To create unforgettable traditional and modern celebrations with creativity, culture, and perfect execution — making every family moment a lifetime memory.'
export const MISSION = 'To deliver high-quality event services with professional artists, innovative decoration, and complete customer satisfaction — from A to Z event management under one roof.'

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
  { q: 'How do I book a decoration?', a: 'Orders are placed on WhatsApp — message any of our three numbers (or Instagram) with your date, venue and the design you like. Phone calls are for emergencies on our two call numbers.' },
  { q: 'How early should I book?', a: 'As early as possible — especially for wedding and festival season. Send us your date and we will check availability.' },
  { q: 'Can you create a custom theme?', a: 'Yes. Share a photo, colour palette or idea and we will design a setup around it.' },
  { q: 'Which areas do you serve?', a: `We are based in ${SITE.address}. Share your venue location and we will confirm if we can cover it.` },
  { q: 'How is the price decided?', a: 'It depends on theme, stage size, materials and venue. Tell us your budget and we will suggest the best options.' },
]
