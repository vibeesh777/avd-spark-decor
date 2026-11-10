// Photo sections shown in the admin. Keep in sync with the website (client/src/config/site.js).
export const ALL_CATEGORIES = [
  'Wedding', 'Birthday', 'Baby Shower', 'Puberty Function', 'Surprise Party', 'Engagement',
  'DJ Setup', 'Teddy Dancers', 'Paper Spray',
]

// Same rule the website uses for page addresses (/gallery/wedding, /gallery/puberty-function …)
export const slugify = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
