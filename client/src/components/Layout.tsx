import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '@/components/Navigation'

function Layout() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout