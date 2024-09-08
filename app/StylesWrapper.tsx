'use client'

import React from 'react'

export default function StylesWrapper() {
  return (
    <style jsx global>{`
      /* Estilos críticos aquí */
      .bg-blue-500 { background-color: #3b82f6; }
      .bg-red-500 { background-color: #ef4444; }
      .bg-green-500 { background-color: #10b981; }
      .text-white { color: #ffffff; }
      .rounded-lg { border-radius: 0.5rem; }
      .font-bold { font-weight: 700; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
    `}</style>
  )
}