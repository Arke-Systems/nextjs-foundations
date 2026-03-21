"use client"

import { updateProduct } from '@/app/actions/products'
import { useState } from 'react'

export function ProductForm({ product }: { product: Product }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage('')

        const result = await updateProduct(product.id, {
            name: formData.get('name') as string,
            price: Number(formData.get('price')),
            inventory: Number(formData.get('inventory')),
        })

        setLoading(false)

        if (result.success) {
            setMessage('Product updated! Cache invalidated.')
        } else {
            setMessage(result.error || 'Failed to update')
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    defaultValue={product.name}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label htmlFor="price">Price</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={product.price}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label htmlFor="inventory">Inventory</label>
                <input
                    id="inventory"
                    name="inventory"
                    type="number"
                    defaultValue={product.inventory}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>

            {message && (
                <p className={message.includes('success') ? 'text-green-600' : 'text-red-600'}>
                    {message}
                </p>
            )}
        </form>
    )
}

interface Product {
    id: string
    name: string
    price: number
    inventory: number
}