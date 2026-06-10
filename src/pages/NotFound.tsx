import { Link } from 'wouter'
import { Meta } from '@/components/ui/Meta'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <>
      <Meta
        path="/404"
        title="Not found — Alex MacLean"
        description="This page drifted away."
      />
      <section className={styles.page}>
        <div className="container">
          <p className="label-mono">Error 404 · No signal at this depth</p>
          <h1 className={`${styles.title} display-hero`}>
            Lost in the <em className="display-italic">abyss</em>
          </h1>
          <p className={styles.note}>
            The page you’re looking for drifted away — or never existed.
          </p>
          <Link href="/" className={`${styles.surface} label-mono`}>
            ↑ Return to the surface
          </Link>
        </div>
      </section>
    </>
  )
}
