import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

const SCOPES = ['user-top-read']

const SpotifyAuthContext = createContext(null)

function getRedirectUri() {
  if (import.meta.env.VITE_SPOTIFY_REDIRECT_URI) {
    return import.meta.env.VITE_SPOTIFY_REDIRECT_URI
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/Projects/TopArtistsMap`
  }

  return ''
}

export function SpotifyAuthProvider({ children }) {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const [authError, setAuthError] = useState(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const sdk = useMemo(() => {
    if (!clientId) {
      return null
    }

    return SpotifyApi.withUserAuthorization(clientId, getRedirectUri(), SCOPES)
  }, [clientId])

  const refreshAuthState = useCallback(async () => {
    if (!sdk) {
      setIsAuthenticated(false)
      return false
    }

    const token = await sdk.getAccessToken()
    const hasToken = Boolean(token?.access_token)
    setIsAuthenticated(hasToken)
    return hasToken
  }, [sdk])

  const login = useCallback(async () => {
    if (!sdk) {
      setAuthError('Missing VITE_SPOTIFY_CLIENT_ID environment variable.')
      return false
    }

    setAuthError(null)
    setIsAuthenticating(true)

    try {
      const response = await sdk.authenticate()
      setIsAuthenticated(Boolean(response?.authenticated))
      return Boolean(response?.authenticated)
    } catch (error) {
      setAuthError(error?.message || 'Spotify authentication failed.')
      setIsAuthenticated(false)
      return false
    } finally {
      setIsAuthenticating(false)
    }
  }, [sdk])

  const logout = useCallback(() => {
    if (sdk) {
      sdk.logOut()
    }

    setIsAuthenticated(false)
    setAuthError(null)
  }, [sdk])

  const value = useMemo(
    () => ({
      sdk,
      clientId,
      isAuthenticated,
      isAuthenticating,
      authError,
      login,
      logout,
      refreshAuthState,
    }),
    [authError, clientId, isAuthenticated, isAuthenticating, login, logout, refreshAuthState, sdk]
  )

  return <SpotifyAuthContext.Provider value={value}>{children}</SpotifyAuthContext.Provider>
}

export function useSpotifyAuth() {
  const context = useContext(SpotifyAuthContext)

  if (!context) {
    throw new Error('useSpotifyAuth must be used within SpotifyAuthProvider')
  }

  return context
}
