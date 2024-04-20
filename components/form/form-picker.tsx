'use client'

import React, { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { defaultImages } from '@/constants/unsplash-images'
import { unsplash } from '@/lib/unsplash'
import { cn } from '@/lib/utils'

import { FormErrors } from './form-errors'

interface FormPickerProps {
  id: string
  errors?: Record<string, string[] | undefined>
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus()

  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await unsplash.photos.getRandom({
          collectionIds: ['317099'],
          count: 9
        })

        if (res && res.response) {
          const newImages = res.response as Array<Record<string, any>>
          setImages(newImages)
        } else {
          console.error('Failed to get images from Unsplash')
        }
      } catch (error) {
        console.error(error)
        setImages(defaultImages)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  const handleSelectImage = (id: string | null) => {
    if (pending) return
    setSelectedImageId(id)
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-4 w-4 text-[#6C63FF] animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              'cursor-pointer relative aspect-video group hover:opacity-75 transition bg-[#6C63FF] rounded-sm',
              pending ? 'opacity-50 hover:opacity-50 cursor-auto' : ''
            )}
            onClick={() => {
              handleSelectImage(image.id)
            }}
          >
            <input
              type="radio"
              name={id}
              id={id}
              className="hidden"
              checked={selectedImageId === image.id}
              readOnly
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            <Image
              src={image.urls.thumb}
              alt="Unsplash image"
              className="object-cover rounded-sm"
              sizes="90px 50px"
              fill
            />
            <div
              className={cn(
                'opacity-0 transition absolute inset-y-0 w-full h-full bg-black/30 flex items-center justify-center',
                selectedImageId === image.id ? 'opacity-100' : ''
              )}
            >
              <Check className="h-4 w-4 text-white" />
            </div>
            <Link
              href={image.links.html}
              target="_blank"
              className="hidden sm:block opacity-0 transition group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  )
}
