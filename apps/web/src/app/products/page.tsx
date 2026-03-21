import { getProducts } from '@/lib/products'
import { ProductForm } from '@/components/product-form'
import { Suspense } from 'react'

export default function ProductsPage() {
    return (
        <main className="mx-auto max-w-4xl p-8">
            <h1 className="mb-8 font-bold text-3xl">Products Management</h1>

            <Suspense fallback={<div>Loading products...</div>}>
                <ProductsList />
            </Suspense>
        </main>
    )
}

async function ProductsList() {
    const products = await getProducts()

    return (
        <div className="space-y-8">
            {products.map((product) => (
                <div key={product.id} className="rounded border p-6">
                    <h2 className="mb-4 font-semibold text-xl">{product.name}</h2>
                    <ProductForm product={product} />
                </div>
            ))}
        </div>
    )
}
