import type { Book } from '../types/book';
import type { Exam } from '../types/exam';
import type { Pack } from '../types/pack';
import type { Product } from '../types/product';

/**
 * Converts a Book object to a standardized Product type
 */
export function bookToProduct(book: Book): Product {
	return {
		id: book.id,
		title: book.title,
		editorialId: book.editorialId,
		price: book.price,
		discount: book.discount,
		level: book.level,
		popularityTags: book.popularityTags || [],
		coverImage: book.coverImage,
		rating: book.rating,
		formatTags: book.formatTags || [],
		featured: book.featured,
		detailsLink: book.detailsLink,
		altText: book.altText,
		productType: 'book',
	};
}

/**
 * Converts an Exam object to a standardized Product type
 */
export function examToProduct(exam: Exam): Product {
	return {
		id: exam.id,
		title: exam.title,
		editorialId: '', // Exams might not have editorialId
		price: exam.price,
		discount: exam.discount,
		level: exam.difficulty, // Map difficulty to level for Product type
		popularityTags: exam.popularityTags || [],
		coverImage: exam.coverImage,
		rating: exam.rating,
		formatTags: exam.formatTags || [],
		featured: exam.featured,
		detailsLink: exam.detailsLink,
		altText: exam.altText,
		examType: exam.examType,
		productType: 'exam',
	};
}

/**
 * Converts a Pack object to a standardized Product type
 */
export function packToProduct(pack: Pack): Product {
	return {
		id: pack.id,
		title: pack.title,
		editorialId: '', // Packs might not have editorialId
		price: pack.price,
		discount: pack.discount,
		level: pack.level,
		popularityTags: pack.popularityTags || [],
		coverImage: pack.coverImage,
		rating: pack.rating,
		formatTags: pack.formatTags || [],
		featured: pack.featured,
		detailsLink: pack.detailsLink,
		altText: pack.altText,
		productType: 'pack',
	};
}

/**
 * Generates recommendations based on a main product and related products
 *
 * @param mainProduct - The main product (book, exam, or pack)
 * @param relatedBooks - Related book products
 * @param relatedExams - Related exam products
 * @param relatedPacks - Related pack products
 * @param maxRecommendations - Maximum number of recommendations to return
 * @returns Array of Product objects as recommendations
 */
export function generateRecommendations(
	mainProduct: Book | Exam | Pack,
	relatedBooks: Book[] = [],
	relatedExams: Exam[] = [],
	relatedPacks: Pack[] = [],
	maxRecommendations: number = 4
): Product[] {
	const recommendations: Product[] = [];

	// Add related books
	if (relatedBooks.length > 0) {
		recommendations.push(
			...relatedBooks.map((book) => bookToProduct(book))
		);
	}

	// Additional logic for books - suggest exams for advanced/professional level
	if (
		'level' in mainProduct &&
		(mainProduct.level === 'advanced' ||
			mainProduct.level === 'professional' ||
			mainProduct.level === 'internationalExam')
	) {
		// Add exam recommendations with higher priority for advanced levels
		if (relatedExams.length > 0) {
			// Insert at beginning to prioritize
			recommendations.unshift(
				...relatedExams.slice(0, 1).map((exam) => examToProduct(exam))
			);
		}
	}

	// Add pack recommendations if available
	if (relatedPacks.length > 0) {
		recommendations.push(
			...relatedPacks.slice(0, 1).map((pack) => packToProduct(pack))
		);
	}

	// Return limited number of recommendations
	return recommendations.slice(0, maxRecommendations);
}

/**
 * Calculate discounted price for a product if discount is available
 */
export function calculateDiscountedPrice(product: Product): number {
	const hasDiscount = product.discount && product.discount > 0;
	return hasDiscount
		? product.price * (1 - (product.discount || 0) / 100)
		: product.price;
}
