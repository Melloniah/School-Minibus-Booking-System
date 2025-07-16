'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch('http://localhost:5000/api/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.role === 'admin') {
          setAuthorized(true)
        } else {
          router.push('/dashboard')
        }
      })
      .catch(() => router.push('/login'))
  }, [])

  if (!authorized) {
    return <p className="p-4">Checking access...</p>
  }

  return (
    <div className="p-4 text-green-700 text-lg font-bold">
    Admin page successfully loaded
    </div>
  )
}
