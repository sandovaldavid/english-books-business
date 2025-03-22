import type { Book, FormatTag, PopularityTag, Rating, BookLevel } from './book';

export interface Pack {
	id: string;
	title: string;
	description: string;
	price: number;
	discount?: number;
	coverImage: string;
	images?: string[];
	video?: string;
	books: Book[];
	rating?: Rating;
	level?: BookLevel | string;
	formatTags?: (FormatTag | string)[];
	popularityTags?: (PopularityTag | string)[];
	featured?: boolean;
	detailsLink: string;
	buyLink: string;
	altText?: string;
	includedItems: string[];
	stock?: number;
}
