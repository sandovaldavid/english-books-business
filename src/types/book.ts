// Book level enum
export enum BookLevel {
	BASIC = 'basic',
	INTERMEDIATE = 'intermediate',
	ADVANCED = 'advanced',
	ALL_LEVELS = 'all-levels',
	PROFESSIONAL = 'professional',
	INTERNATIONAL_EXAM = 'International Exam',
}

// Format tag enum
export enum FormatTag {
	PDF = 'pdf',
	WORKBOOK = 'workbook',
	AUDIO = 'audio',
	VIDEO = 'video',
	SOFTWARE = 'software',
	EXAMS = 'exams',
}

// Popularity tag enum
export enum PopularityTag {
	BESTSELLER = 'bestseller',
	NEW = 'new',
	SPECIAL_OFFER = 'special-offer',
	COMPLETE_PACK = 'complete-pack',
	RECOMMENDED = 'recommended',
}

// Book interface
export interface Book {
	id: string;
	title: string;
	description: string;
	price: number;
	coverImage: string;
	altText?: string;
	includedItems: string[];
	rating?: {
		score: number;
		reviewCount: number;
	};
	buyLink: string;
	detailsLink: string;
	discount?: number;
	level?: BookLevel;
	featured?: boolean;
	formatTags?: FormatTag[];
	popularityTags?: PopularityTag[];
}
