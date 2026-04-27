
export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
        {product?.image ? (
          <img src={product.image} alt={product.name} className="h-36 object-contain" />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600 truncate">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold">₹{product.price}</span>
        <span className="text-sm text-gray-500">Stock: {product.quantity ?? 0}</span>
      </div>
    </div>
  );
}
