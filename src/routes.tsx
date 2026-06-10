import { useEffect } from 'react'
import { Switch, Route, Redirect, useLocation } from 'wouter'
import Home from '@/pages/Home'
import WorkIndex from '@/pages/WorkIndex'
import WorkDetail from '@/pages/WorkDetail'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'
import { LEGACY_SLUGS } from '@/data/projects'
import { scrollToTop } from '@/lib/SmoothScroll'
import { useAppStore } from '@/store/app'

/** Scene mood key per route — consumed by the WebGL MoodController. */
function moodFor(path: string): string {
  if (path === '/') return 'home'
  if (path === '/work') return 'work'
  if (path.startsWith('/work/')) return 'detail'
  if (path.startsWith('/about')) return 'about'
  if (path.startsWith('/contact')) return 'contact'
  return 'abyss'
}

/** /cv must leave the SPA — it's a static PDF. */
function CvRedirect() {
  useEffect(() => {
    window.location.replace('/cv.pdf')
  }, [])
  return null
}

export function Routes() {
  const [location] = useLocation()
  const setMoodKey = useAppStore((s) => s.setMoodKey)

  useEffect(() => {
    scrollToTop(true)
    setMoodKey(moodFor(location))
  }, [location, setMoodKey])

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/work" component={WorkIndex} />
      <Route path="/work/:slug">
        {(params) => <WorkDetail slug={params.slug} />}
      </Route>
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />

      {/* Legacy URLs from the Jekyll site */}
      <Route path="/portfolio">
        <Redirect to="/work" replace />
      </Route>
      <Route path="/portfolio/:slug">
        {(params) => (
          <Redirect
            to={`/work/${LEGACY_SLUGS[params.slug] ?? params.slug}`}
            replace
          />
        )}
      </Route>
      <Route path="/cv" component={CvRedirect} />
      <Route path="/blog/*?">
        <Redirect to="/" replace />
      </Route>

      <Route component={NotFound} />
    </Switch>
  )
}
