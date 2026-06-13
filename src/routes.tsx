import { lazy, Suspense, useEffect } from 'react'
import { Switch, Route, Redirect, useLocation } from 'wouter'
import Home from '@/pages/Home'
import { LEGACY_SLUGS } from '@/data/projects'
import { scrollToTop } from '@/lib/SmoothScroll'
import { useAppStore } from '@/store/app'

// Home ships in the main bundle: it's the landing route, and its <h1>
// must exist on first paint for the PageTransition hero reveal. The rest
// are split into their own chunks and warmed on idle (see below) so that
// by the time a link is clicked the module is cached — React.lazy then
// renders it synchronously, no fallback flash, and PageTransition still
// finds the new page's <h1> right after commit.
const WorkIndex = lazy(() => import('@/pages/WorkIndex'))
const WorkDetail = lazy(() => import('@/pages/WorkDetail'))
const Sunntack = lazy(() => import('@/pages/Sunntack'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const warmRouteChunks = () => {
  void import('@/pages/WorkIndex')
  void import('@/pages/WorkDetail')
  void import('@/pages/Sunntack')
  void import('@/pages/About')
  void import('@/pages/Contact')
}

/** Scene mood key per route — consumed by the WebGL MoodController. */
function moodFor(path: string): string {
  if (path === '/') return 'home'
  if (path === '/work') return 'work'
  if (path.startsWith('/work/')) return 'detail'
  if (path.startsWith('/sunntack')) return 'sunntack'
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

  // Warm the non-home route chunks once the browser is idle.
  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warmRouteChunks)
      return () => window.cancelIdleCallback?.(id)
    }
    const t = setTimeout(warmRouteChunks, 1200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    scrollToTop(true)
    setMoodKey(moodFor(location))
    // SPA page views (child Meta effects have already set document.title)
    window.gtag?.('event', 'page_view', {
      page_path: location,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [location, setMoodKey])

  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/work" component={WorkIndex} />
        <Route path="/work/:slug">
          {(params) => <WorkDetail slug={params.slug} />}
        </Route>
        <Route path="/sunntack" component={Sunntack} />
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
    </Suspense>
  )
}
