import { useEffect } from 'react'

const VERSION_URL = `${import.meta.env.BASE_URL}version.json`
const RELOAD_PARAM = '__deployment'
const CURRENT_VERSION = import.meta.env.VITE_BUILD_ID

type DeploymentVersion = {
  version: string
}

export function useDeploymentRefresh() {
  useEffect(() => {
    if (!CURRENT_VERSION) return

    const checkDeployment = async () => {
      try {
        const response = await fetch(`${VERSION_URL}?check=${Date.now()}`, {
          cache: 'no-store',
        })
        if (!response.ok) {
          throw new Error(`Version check failed with status ${response.status}`)
        }

        const deployment = (await response.json()) as DeploymentVersion
        if (typeof deployment.version !== 'string' || !deployment.version) {
          throw new Error('The deployment version response is invalid.')
        }

        if (deployment.version === CURRENT_VERSION) {
          if (new URLSearchParams(window.location.search).has(RELOAD_PARAM)) {
            const url = new URL(window.location.href)
            url.searchParams.delete(RELOAD_PARAM)
            window.history.replaceState(window.history.state, '', url)
          }
          return
        }

        const params = new URLSearchParams(window.location.search)
        if (params.has(RELOAD_PARAM)) return

        const reloadAttemptKey = `deployment-refresh:${deployment.version}`
        if (sessionStorage.getItem(reloadAttemptKey)) return
        sessionStorage.setItem(reloadAttemptKey, 'true')

        const url = new URL(window.location.href)
        url.searchParams.set(RELOAD_PARAM, Date.now().toString())
        window.location.replace(url)
      } catch (error) {
        console.warn('Unable to check for a new site deployment.', error)
      }
    }

    void checkDeployment()
    const interval = window.setInterval(() => void checkDeployment(), 5 * 60 * 1000)
    window.addEventListener('focus', checkDeployment)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', checkDeployment)
    }
  }, [])
}
