import { Product } from "../../app/assignment-2/types/product";

export const DeleteConfirmationModal = ({ product, onConfirm, onCancel }: {
    product: Product;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Product</h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete <span className="font-semibold">"{product.title}"</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
            
        </div>
    );
  };