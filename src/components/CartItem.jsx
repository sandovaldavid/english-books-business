import React from 'react';

/**
 * CartItem component for displaying an individual item in the shopping cart
 */
const CartItem = ({ item, onUpdateQuantity, onRemove, index }) => {
	const { title, price, image, quantity, type } = item;
	const itemTotal = price * quantity;

	const handleDecrease = () => {
		if (quantity > 1) {
			onUpdateQuantity(index, quantity - 1);
		}
	};

	const handleIncrease = () => {
		onUpdateQuantity(index, quantity + 1);
	};

	const handleRemove = () => {
		onRemove(index);
	};

	// Map product type to human-readable label
	const getProductTypeLabel = (type) => {
		switch (type) {
			case 'book':
				return 'Libro';
			case 'exam':
				return 'Examen';
			case 'pack':
				return 'Pack';
			default:
				return 'Producto';
		}
	};

	return (
		<div className='flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
			{/* Product image */}
			<div className='flex-shrink-0 w-20 h-20 mb-3 sm:mb-0 sm:mr-4'>
				<img
					src={image}
					alt={title}
					className='w-full h-full object-cover rounded'
				/>
			</div>

			{/* Product info */}
			<div className='flex-grow text-center sm:text-left'>
				<h4 className='font-bold text-gray-800'>{title}</h4>
				<div className='text-sm text-gray-500 mb-1'>
					{getProductTypeLabel(type)}
				</div>

				<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2'>
					{/* Price */}
					<div className='text-primary font-bold'>
						S/{price.toFixed(2)}
					</div>

					{/* Quantity controls */}
					<div className='flex items-center justify-center sm:justify-end mt-2 sm:mt-0'>
						<button
							className='bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-2 rounded-l'
							onClick={handleDecrease}
							aria-label='Decrease quantity'>
							-
						</button>

						<span className='bg-gray-100 py-1 px-3'>
							{quantity}
						</span>

						<button
							className='bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-2 rounded-r'
							onClick={handleIncrease}
							aria-label='Increase quantity'>
							+
						</button>

						<button
							className='ml-4 text-red-500 hover:text-red-700'
							onClick={handleRemove}
							aria-label='Remove item'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								viewBox='0 0 20 20'
								fill='currentColor'>
								<path
									fillRule='evenodd'
									d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
									clipRule='evenodd'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
