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

const CatalogFilter = ({
	initialLevel = 'all',
	initialFormat = 'all',
	initialSort = 'featured',
}) => {
	// State for filters
	const [level, setLevel] = useState(initialLevel);
	const [format, setFormat] = useState(initialFormat);
	const [sort, setSort] = useState(initialSort);
	const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
	const [activeTags, setActiveTags] = useState([]);

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
	};

	// Default values that don't count as active filters
	const defaultValues = {
		level: 'all',
		format: 'all',
		sort: 'featured',
	};

	// Calculate active filter count for badge
	const activeFilterCount = [level, format].filter((v) => v !== 'all').length;

	// Update active tags when filter values change
	useEffect(() => {
		const newTags = [];

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

		setActiveTags(newTags);
	}, [level, format]);

	// Listen for reset filters event from outside this component
	useEffect(() => {
		const handleResetFilters = () => {
			setLevel('all');
			setFormat('all');
			setSort('featured');
			applyFilters('all', 'all', 'featured');
		};

		document.addEventListener('resetFilters', handleResetFilters);

		// Cleanup listener on component unmount
		return () => {
			document.removeEventListener('resetFilters', handleResetFilters);
		};
	}, []);

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
		}
	};

	// Apply filters
	const applyFilters = (
		currentLevel = level,
		currentFormat = format,
		currentSort = sort
	) => {
		setMobileFiltersVisible(false);

		// Enviar evento a Astro
		const event = new CustomEvent('filterChange', {
			detail: {
				level: currentLevel,
				format: currentFormat,
				sort: currentSort,
			},
		});
		window.dispatchEvent(event);
	};

	// Clear all filters
	const clearFilters = () => {
		setLevel('all');
		setFormat('all');
		setSort('featured');

		// Apply the cleared filters
		applyFilters('all', 'all', 'featured');
	};

	// Remove a specific filter tag
	const removeFilterTag = (name) => {
		const newLevel = name === 'level' ? 'all' : level;
		const newFormat = name === 'format' ? 'all' : format;

		if (name === 'level') setLevel('all');
		if (name === 'format') setFormat('all');

		// Apply the updated filters
		applyFilters(newLevel, newFormat, sort);
	};

	// Toggle mobile filters visibility
	const toggleMobileFilters = () => {
		setMobileFiltersVisible(!mobileFiltersVisible);
	};

	return (
		<div
			id='catalog-filters'
			className='bg-white rounded-xl shadow-md p-4 md:p-6 mb-8 filter-container'>
			<form
				id='filter-form'
				className='filter-form'
				onSubmit={(e) => {
					e.preventDefault();
					applyFilters();
				}}>
				<div className='flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-8'>
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

					<div className='flex items-center gap-3'>
						<button
							type='button'
							onClick={() => applyFilters()}
							className='hidden md:flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg min-w-[100px] justify-center apply-filters-btn'>
							Aplicar
						</button>
					</div>
				</div>

				{/* Active filter tags */}
				{activeTags.length > 0 && (
					<div
						className='flex flex-wrap gap-2 mt-4 active-filters'
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
