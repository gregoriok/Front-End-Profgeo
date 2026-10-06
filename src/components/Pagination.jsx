export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;

    let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let end = Math.min(totalPages, start + maxPages - 1);

    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-bold">{startItem}</span> a <span className="font-bold">{endItem}</span> de <span className="font-bold">{totalItems}</span> itens
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border border-profgeo-200 text-profgeo-600 hover:bg-profgeo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>

        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg transition ${
              currentPage === page
                ? 'bg-profgeo-600 text-white'
                : 'border border-profgeo-200 text-profgeo-600 hover:bg-profgeo-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border border-profgeo-200 text-profgeo-600 hover:bg-profgeo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
