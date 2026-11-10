import usePhotos from '../hooks/usePhotos'
import useMeta from '../hooks/useMeta'
import useReveal from '../hooks/useReveal'
import SectionHead from '../components/SectionHead'
import FunctionCard from '../components/FunctionCard'
import BookingOptions from '../components/BookingOptions'
import { FUNCTIONS } from '../config/site'

export default function Gallery() {
  useMeta('Gallery', 'Wedding, birthday, baby shower, puberty function, engagement, DJ, teddy dancer and paper spray photos. Touch a function to see all its pictures.')
  const photos = usePhotos()
  useReveal(photos)

  return (
    <div className="page">
      <div className="container">
        <SectionHead as="h1" eyebrow="Our work" title="Photo" accent="Gallery"
          sub="Touch a function to see all of its pictures." />
        <div className="fn-grid">
          {FUNCTIONS.map(f => <FunctionCard key={f.slug} fn={f} photos={photos?.[f.name]} />)}
        </div>
        <div className="form-card narrow-card reveal" style={{ marginTop: 80 }}>
          <h2>Like what you see?</h2>
          <BookingOptions />
        </div>
      </div>
    </div>
  )
}
