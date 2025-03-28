import React, { useState, useEffect } from 'react';

// Create BookLevel and FormatTag as standard JavaScript objects instead of TypeScript enums
const BookLevel = {
	BASIC: 'basic',
	INTERMEDIATE: 'intermediate',
	ADVANCED: 'advanced',
	ALL_LEVELS: 'all-levels',
	PROFESSIONAL: 'professional',
	INTERNATIONAL_EXAM: 'International Exam',
};

const FormatTag = {
	PDF: 'pdf',
	WORKBOOK: 'workbook',
	AUDIO: 'audio',
	VIDEO: 'video',
	SOFTWARE: 'software',
	EXAMS: 'exams',
};

// Resource types for new filter
const ResourceType = {
	ANY: 'any',
	BOOK: 'book',
	PACK: 'pack',
	EXAM: 'exam',
};

// Icons need to be converted to React components or imported from a library
// For now we'll create placeholder components
const FilterIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='w-5 h-5'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fillRule='evenodd'
			d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
			clipRule='evenodd'
		/>
	</svg>
);

const SortIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='w-4 h-4'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path d='M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z' />
	</svg>
);

const ArrowDownIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='w-5 h-5'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fillRule='evenodd'
			d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
			clipRule='evenodd'
		/>
	</svg>
);

const ArrowRightIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='w-4 h-4'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fillRule='evenodd'
			d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
			clipRule='evenodd'
		/>
	</svg>
);

const SearchIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='w-5 h-5'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fillRule='evenodd'
			d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
			clipRule='evenodd'
		/>
	</svg>
);

const ClearIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='w-5 h-5'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fillRule='evenodd'
			d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
			clipRule='evenodd'
		/>
	</svg>
);

const CatalogFilter = ({
	initialLevel = 'all',
	initialFormat = 'all',
	initialSort = 'featured',
	initialResourceType = 'any',
	enableResourceTypeFilter = false, // New prop to control if resource type filtering is enabled
	resourceType: propResourceType = 'any', // Resource type passed as prop
	productType = 'book', // Default product type context
	productCount = 0,
	className = '',
}) => {
	// State for filters
	const [level, setLevel] = useState(initialLevel);
	const [format, setFormat] = useState(initialFormat);
	const [sort, setSort] = useState(initialSort);
	const [resourceType, setResourceType] = useState(
		propResourceType || initialResourceType
	);
	const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
	const [activeTags, setActiveTags] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	// New state for showing resource type filter
	const [showTypeFilter, setShowTypeFilter] = useState(enableResourceTypeFilter);

	// State for displayed product count
	const [displayedProductCount, setDisplayedProductCount] = useState(productCount);

	// Update resource type when prop changes
	useEffect(() => {
		if (propResourceType !== resourceType) {
			setResourceType(propResourceType);
		}
	}, [propResourceType]);

	// Update showTypeFilter when enableResourceTypeFilter prop changes
	useEffect(() => {
		setShowTypeFilter(enableResourceTypeFilter);
	}, [enableResourceTypeFilter]);

	// Listen for product count updates from outside the component
	useEffect(() => {
		const handleProductCountUpdate = (event) => {
			if (event.detail && typeof event.detail.count === 'number') {
				setDisplayedProductCount(event.detail.count);
			}
		};

		window.addEventListener('updateFilterCount', handleProductCountUpdate);

		// Cleanup listener on component unmount
		return () => {
			window.removeEventListener('updateFilterCount', handleProductCountUpdate);
		};
	}, []);

	// Filter options including "all" and enum values
	const levelOptions = [
		{ value: 'all', label: 'Todos los niveles' },
		...Object.entries(BookLevel).map(([_, value]) => {
			// Map enum values to human-readable labels
			const label = (() => {
				switch (value) {
					case BookLevel.BASIC:
						return 'Básico';
					case BookLevel.INTERMEDIATE:
						return 'Intermedio';
					case BookLevel.ADVANCED:
						return 'Avanzado';
					case BookLevel.PROFESSIONAL:
						return 'Profesional';
					case BookLevel.ALL_LEVELS:
						return 'Multi-nivel';
					case BookLevel.INTERNATIONAL_EXAM:
						return 'Examen Internacional';
					default:
						return value;
				}
			})();

			return { value, label };
		}),
	];

	// Format options including "all" and enum values
	const formatOptions = [
		{ value: 'all', label: 'Todos los formatos' },
		...Object.entries(FormatTag).map(([_, value]) => {
			// Map enum values to human-readable labels
			const label = (() => {
				switch (value) {
					case FormatTag.PDF:
						return 'PDF';
					case FormatTag.WORKBOOK:
						return 'Workbook';
					case FormatTag.AUDIO:
						return 'Audio';
					case FormatTag.VIDEO:
						return 'Video';
					case FormatTag.SOFTWARE:
						return 'Software';
					case FormatTag.EXAMS:
						return 'Exámenes';
					default:
						return value;
				}
			})();

			return { value, label };
		}),
	];

	// Resource type options
	const resourceTypeOptions = [
		{ value: 'any', label: 'Todos los tipos' },
		{ value: 'book', label: 'Libros' },
		{ value: 'pack', label: 'Packs' },
		{ value: 'exam', label: 'Exámenes' },
	];

	const sortOptions = [
		{ value: 'featured', label: 'Destacados' },
		{ value: 'price-low', label: 'Precio: menor a mayor' },
		{ value: 'price-high', label: 'Precio: mayor a menor' },
		{ value: 'newest', label: 'Más recientes' },
		{ value: 'bestseller', label: 'Más vendidos' },
	];

	// Define filter labels for display
	const filterLabels = {
		level: 'Nivel',
		format: 'Formato',
		sort: 'Orden',
		search: 'Búsqueda',
		resourceType: 'Tipo',
	};

	// Default values that don't count as active filters
	const defaultValues = {
		level: 'all',
		format: 'all',
		sort: 'featured',
		search: '',
		resourceType: 'any',
	};

	// Calculate active filter count for badge - including resourceType when enabled
	const activeFilterCount = [
		level !== 'all' ? 1 : 0,
		format !== 'all' ? 1 : 0,
		searchTerm ? 1 : 0,
		(showTypeFilter && resourceType !== 'any') ? 1 : 0,
	].reduce((a, b) => a + b, 0);

	// Update active tags when filter values change
	useEffect(() => {
		const newTags = [];

		// Add search tag if not empty
		if (searchTerm) {
			newTags.push({
				name: 'search',
				value: searchTerm,
				label: `"${searchTerm}"`,
				displayName: filterLabels.search,
			});
		}

		// Add level tag if not default
		if (level !== 'all') {
			const option = levelOptions.find((opt) => opt.value === level);
			if (option) {
				newTags.push({
					name: 'level',
					value: level,
					label: option.label,
					displayName: filterLabels.level,
				});
			}
		}

		// Add format tag if not default
		if (format !== 'all') {
			const option = formatOptions.find((opt) => opt.value === format);
			if (option) {
				newTags.push({
					name: 'format',
					value: format,
					label: option.label,
					displayName: filterLabels.format,
				});
			}
		}

		// Add resource type tag if enabled and not default
		if (showTypeFilter && resourceType !== 'any') {
			const option = resourceTypeOptions.find((opt) => opt.value === resourceType);
			if (option) {
				newTags.push({
					name: 'resourceType',
					value: resourceType,
					label: option.label,
					displayName: filterLabels.resourceType,
				});
			}
		}

		setActiveTags(newTags);
	}, [level, format, searchTerm, resourceType, showTypeFilter]);

	// Listen for reset filters event from outside this component
	useEffect(() => {
		const handleResetFilters = () => {
			setLevel('all');
			setFormat('all');
			setSort('featured');
			setSearchTerm('');
			if (showTypeFilter) setResourceType('any');
			applyFilters('all', 'all', 'featured', showTypeFilter ? 'any' : resourceType, '');
		};

		document.addEventListener('resetFilters', handleResetFilters);

		// Cleanup listener on component unmount
		return () => {
			document.removeEventListener('resetFilters', handleResetFilters);
		};
	}, [showTypeFilter, resourceType]);

	// Handler for filter changes
	const handleFilterChange = (name, value) => {
		switch (name) {
			case 'level':
				setLevel(value);
				break;
			case 'format':
				setFormat(value);
				break;
			case 'sort':
				setSort(value);
				break;
			case 'search':
				setSearchTerm(value);
				break;
			case 'resourceType':
				setResourceType(value);
				break;
		}
	};

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle search form submission
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		applyFilters(level, format, sort, resourceType, searchTerm);
	};

	// Clear search term
	const clearSearch = () => {
		setSearchTerm('');
		applyFilters(level, format, sort, resourceType, '');
	};

	// Apply filters
	const applyFilters = (
		currentLevel = level,
		currentFormat = format,
		currentSort = sort,
		currentResourceType = resourceType,
		currentSearchTerm = searchTerm
	) => {
		setMobileFiltersVisible(false);

		// Dispatch event to Astro
		const event = new CustomEvent('filterChange', {
			detail: {
				level: currentLevel,
				format: currentFormat,
				sort: currentSort,
				resourceType: showTypeFilter ? currentResourceType : 'any',
				search: currentSearchTerm,
			},
		});
		window.dispatchEvent(event);
	};

	// Clear all filters - don't reset resource type if it's prop-controlled and filter is disabled
	const clearFilters = () => {
		setLevel('all');
		setFormat('all');
		setSort('featured');
		setSearchTerm('');
		if (showTypeFilter) setResourceType('any');

		// Apply the cleared filters but keep resource type if not enabled
		applyFilters('all', 'all', 'featured', showTypeFilter ? 'any' : resourceType, '');
	};

	// Remove a specific filter tag
	const removeFilterTag = (name) => {
		const newLevel = name === 'level' ? 'all' : level;
		const newFormat = name === 'format' ? 'all' : format;
		const newSearchTerm = name === 'search' ? '' : searchTerm;
		const newResourceType = name === 'resourceType' ? 'any' : resourceType;

		if (name === 'level') setLevel('all');
		if (name === 'format') setFormat('all');
		if (name === 'search') setSearchTerm('');
		if (name === 'resourceType') setResourceType('any');

		// Apply the updated filters
		applyFilters(newLevel, newFormat, sort, newResourceType, newSearchTerm);
	};

	// Toggle mobile filters visibility
	const toggleMobileFilters = () => {
		setMobileFiltersVisible(!mobileFiltersVisible);
	};

	// Toggle resource type filter
	const toggleTypeFilter = () => {
		setShowTypeFilter(!showTypeFilter);

		// If we're hiding the filter, reset to "any" and apply filters
		if (showTypeFilter) {
			setResourceType('any');
			applyFilters(level, format, sort, 'any', searchTerm);
		}
	};

	return (
		<div
			id='catalog-filters'
			className={`bg-white rounded-xl shadow-md p-4 md:p-6 mb-8 filter-container min-w-full md:min-w-[600px] ${className}`}>
			<form
				id='filter-form'
				className='filter-form'
				onSubmit={handleSearchSubmit}>
				{/* Search Bar - Always visible */}
				<div className='mb-4 md:mb-6 px-4 md:px-8'>
					<div
						className={`relative transition-all duration-300 ${
							isSearchFocused ? 'ring-2 ring-primary' : ''
						}`}>
						<input
							type='text'
							placeholder='Buscar por título, autor, editorial...'
							value={searchTerm}
							onChange={handleSearchChange}
							onFocus={() => setIsSearchFocused(true)}
							onBlur={() => setIsSearchFocused(false)}
							className='w-full py-3 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none hover:bg-white transition-all duration-300'
							aria-label='Buscar'
						/>
						<div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
							<SearchIcon />
						</div>
						{searchTerm && (
							<button
								type='button'
								className='absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
								onClick={clearSearch}
								aria-label='Limpiar búsqueda'>
								<ClearIcon />
							</button>
						)}
						<button
							type='submit'
							className='absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white rounded-md p-1 hover:bg-primary-dark transition-colors'
							aria-label='Buscar'>
							<ArrowRightIcon />
						</button>
					</div>

					{/* Filters count, results count, and toggle for resource type filter */}
					<div className='flex items-center justify-between mt-3 text-sm text-gray-500'>
						<div className='flex items-center'>
							<span>
									{displayedProductCount}{' '}
								{displayedProductCount === 1
									? 'resultado'
									: 'resultados'}
							</span>
							{activeFilterCount > 0 && (
								<span className='ml-2'>
									• {activeFilterCount} filtro
									{activeFilterCount !== 1 && 's'} aplicado
									{activeFilterCount !== 1 && 's'}
								</span>
							)}
						</div>

						{/* Toggle switch for resource type filter */}
						<div className='flex items-center'>
							<span className='mr-2 text-xs'>Filtrar por tipo</span>
							<button
								type="button"
								onClick={toggleTypeFilter}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showTypeFilter ? 'bg-primary' : 'bg-gray-300'}`}
								role="switch"
								aria-checked={showTypeFilter}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showTypeFilter ? 'translate-x-6' : 'translate-x-1'}`}
								/>
							</button>
						</div>
					</div>
				</div>

				{/* Rest of mobile and desktop filters */}
				<div className='flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-4 md:px-8'>
					{/* Mobile filter button with badge */}
					<button
						type='button'
						className='md:hidden flex items-center justify-between w-full bg-neutral-light px-4 py-3 rounded-lg text-primary-dark font-medium filter-toggle relative'
						aria-expanded={mobileFiltersVisible ? 'true' : 'false'}
						onClick={toggleMobileFilters}>
						<span className='flex items-center'>
							<FilterIcon />
							<span className='ml-2'>Filtrar y ordenar</span>
							{activeFilterCount > 0 && (
								<span className='ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center filter-count-badge'>
									{activeFilterCount}
								</span>
							)}
						</span>
						<span
							className={`transition-transform duration-300 ${
								mobileFiltersVisible ? 'rotate-180' : ''
							}`}>
							<ArrowDownIcon />
						</span>
					</button>

					{/* Mobile filters */}
					{mobileFiltersVisible && (
						<div
							id='mobile-filters'
							className='w-full md:hidden space-y-4 bg-white rounded-lg p-4 shadow-inner animate-fade-in'>
							<div className='space-y-2'>
								<label className='block text-sm font-medium text-gray-700'>
									Nivel
								</label>
								<div className='relative'>
									<select
										name='level'
										value={level}
										onChange={(e) =>
											handleFilterChange(
												'level',
												e.target.value
											)
										}
										className='w-full rounded-lg border-gray-300 shadow-sm py-2.5 px-4 appearance-none bg-neutral-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary mobile-filter-select'>
										{levelOptions.map((option) => (
											<option
												key={option.value}
												value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
										<ArrowDownIcon />
									</span>
								</div>
							</div>

							<div className='space-y-2'>
								<label className='block text-sm font-medium text-gray-700'>
									Formato
								</label>
								<div className='relative'>
									<select
										name='format'
										value={format}
										onChange={(e) =>
											handleFilterChange(
												'format',
												e.target.value
											)
										}
										className='w-full rounded-lg border-gray-300 shadow-sm py-2.5 px-4 appearance-none bg-neutral-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary mobile-filter-select'>
										{formatOptions.map((option) => (
											<option
												key={option.value}
												value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
										<ArrowDownIcon />
									</span>
								</div>
							</div>

							{/* Resource type filter in mobile - only shown when enabled */}
							{showTypeFilter && (
								<div className='space-y-2'>
									<label className='block text-sm font-medium text-gray-700'>
										Tipo de producto
									</label>
									<div className='relative'>
										<select
											name='resourceType'
											value={resourceType}
											onChange={(e) =>
												handleFilterChange(
													'resourceType',
													e.target.value
												)
											}
											className='w-full rounded-lg border-gray-300 shadow-sm py-2.5 px-4 appearance-none bg-neutral-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary mobile-filter-select'>
											{resourceTypeOptions.map((option) => (
												<option
													key={option.value}
													value={option.value}>
													{option.label}
												</option>
											))}
										</select>
										<span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
											<ArrowDownIcon />
										</span>
									</div>
								</div>
							)}

							<div className='space-y-2'>
								<label className='block text-sm font-medium text-gray-700'>
									Ordenar por
								</label>
								<div className='relative'>
									<select
										name='sort'
										value={sort}
										onChange={(e) =>
											handleFilterChange(
												'sort',
												e.target.value
											)
										}
										className='w-full rounded-lg border-gray-300 shadow-sm py-2.5 px-4 appearance-none bg-neutral-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary mobile-filter-select'>
										{sortOptions.map((option) => (
											<option
												key={option.value}
												value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
										<ArrowDownIcon />
									</span>
								</div>
							</div>

							<button
								type='button'
								onClick={() => applyFilters()}
								className='w-full bg-primary text-white py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 font-medium flex items-center justify-center apply-filters-btn'>
								<span>Aplicar filtros</span>
								<span className='ml-2'>
									<ArrowRightIcon />
								</span>
							</button>

							<button
								type='button'
								onClick={clearFilters}
								className='w-full bg-neutral py-2 px-4 rounded-lg text-gray-700 hover:bg-neutral-dark transition-colors duration-300 font-medium flex items-center justify-center mt-2 clear-filters-btn'>
								Limpiar filtros
							</button>
						</div>
					)}

					{/* Desktop filters */}
					<div className='hidden md:flex flex-wrap gap-4 items-center flex-1'>
						<div className='relative flex items-center'>
							<div className='flex items-center p-1.5 rounded-full bg-primary/10 mr-2'>
								<FilterIcon />
							</div>
							<div className='relative'>
								<select
									name='level'
									value={level}
									onChange={(e) =>
										handleFilterChange(
											'level',
											e.target.value
										)
									}
									className='appearance-none bg-neutral-light text-primary-dark px-4 py-2.5 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-300 hover:shadow filter-select'
									aria-label='Filtrar por nivel'>
									{levelOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}>
											{option.label}
										</option>
									))}
								</select>
								<span className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
									<ArrowDownIcon />
								</span>
							</div>
						</div>

						<div className='relative'>
							<select
								name='format'
								value={format}
								onChange={(e) =>
									handleFilterChange('format', e.target.value)
								}
								className='appearance-none bg-neutral-light text-primary-dark px-4 py-2.5 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-300 hover:shadow filter-select'
								aria-label='Filtrar por formato'>
								{formatOptions.map((option) => (
									<option
										key={option.value}
										value={option.value}>
										{option.label}
									</option>
								))}
							</select>
							<span className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
								<ArrowDownIcon />
							</span>
						</div>

						{/* Resource type filter - only shown when enabled */}
						{showTypeFilter && (
							<div className='relative'>
								<select
									name='resourceType'
									value={resourceType}
									onChange={(e) =>
										handleFilterChange('resourceType', e.target.value)
									}
									className='appearance-none bg-neutral-light text-primary-dark px-4 py-2.5 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-300 hover:shadow filter-select'
									aria-label='Filtrar por tipo de producto'>
									{resourceTypeOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}>
											{option.label}
										</option>
									))}
								</select>
								<span className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
									<ArrowDownIcon />
								</span>
							</div>
						)}

						<div className='relative'>
							<div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>
								<SortIcon />
							</div>
							<select
								name='sort'
								value={sort}
								onChange={(e) =>
									handleFilterChange('sort', e.target.value)
								}
								className='appearance-none bg-neutral-light text-primary-dark pl-9 pr-8 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-300 hover:shadow filter-select sort-select'>
								{sortOptions.map((option) => (
									<option
										key={option.value}
										value={option.value}>
										{option.label}
									</option>
								))}
							</select>
							<span className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
								<ArrowDownIcon />
							</span>
						</div>
					</div>

					<div className='hidden md:flex items-center gap-3'>
						<button
							type='button'
							onClick={() => applyFilters()}
							className='flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg min-w-[100px] justify-center apply-filters-btn'>
							Aplicar
						</button>

						{activeFilterCount > 0 && (
							<button
								type='button'
								onClick={clearFilters}
								className='flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-colors duration-300 justify-center'
								aria-label='Limpiar todos los filtros'>
								<ClearIcon />
							</button>
						)}
					</div>
				</div>

				{/* Active filter tags */}
				{activeTags.length > 0 && (
					<div
						className='flex flex-wrap gap-2 mt-4 px-8 active-filters'
						aria-live='polite'>
						{activeTags.map((tag) => (
							<div
								key={`${tag.name}-${tag.value}`}
								className='inline-flex items-center bg-primary-light/20 text-primary-dark text-sm px-3 py-1.5 rounded-full filter-tag gap-1.5 group hover:bg-primary-light/30 transition-colors'>
								<span className='text-xs text-primary-dark/70'>
									{tag.displayName}:
								</span>
								<span className='font-medium'>{tag.label}</span>
								<button
									type='button'
									onClick={() => removeFilterTag(tag.name)}
									className='ml-1 group-hover:bg-white/80 rounded-full w-4 h-4 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary'
									aria-label={`Eliminar filtro ${tag.displayName}: ${tag.label}`}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-3 w-3'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				)}
			</form>
		</div>
	);
};

// Default export for proper importing
export default CatalogFilter;
