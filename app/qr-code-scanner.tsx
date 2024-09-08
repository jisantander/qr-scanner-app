'use client'

import React, { useState, useRef, useEffect } from 'react'
import QrScanner from 'qr-scanner'
import { Scan, StopCircle, Upload } from 'lucide-react'

export default function QRCodeScanner() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const qrScannerRef = useRef<QrScanner | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy()
      }
    }
  }, [])

  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => console.error('Error playing audio:', error))
    }
  }

  const startScanner = async () => {
    if (!videoRef.current) return

    try {
      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        throw new Error('No se detectó ninguna cámara en el dispositivo.')
      }

      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          setResult(result.data)
          setIsScanning(false)
          qrScanner.stop()
          playBeep()
        },
        {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
          returnDetailedScanResult: true,
        }
      )

      await qrScanner.start()
      qrScannerRef.current = qrScanner
      setIsScanning(true)
      setError(null)
    } catch (err) {
      console.error('Error starting scanner:', err)
      setError(`Error al iniciar el escáner: ${err instanceof Error ? err.message : 'Se produjo un error desconocido'}`)
    }
  }

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
      setIsScanning(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const result = await QrScanner.scanImage(file)
        setResult(result)
        playBeep()
      } catch (error) {
        console.error('Error scanning image:', error)
        setError('No se pudo leer el código QR de la imagen.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Escáner de Código QR</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="relative w-full aspect-square mb-6">
          <video ref={videoRef} className="w-full h-full object-cover rounded-lg"></video>
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <p className="text-white text-lg font-semibold">Cámara inactiva</p>
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2 mb-4">
          {!isScanning ? (
            <button
              onClick={startScanner}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <Scan className="mr-2" />
              Iniciar Escáner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <StopCircle className="mr-2" />
              Detener Escáner
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
          >
            <Upload className="mr-2" />
            Subir imagen
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Resultado:</h2>
            <p className="text-gray-600 break-words">{result}</p>
          </div>
        )}
      </div>
      <audio ref={audioRef} src="/beep.mp3" />
    </div>
  )
}