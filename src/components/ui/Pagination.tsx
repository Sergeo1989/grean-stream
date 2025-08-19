import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaAngleDoubleLeft, 
  FaAngleDoubleRight 
} from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  className,
}) => {
  // Calculer les éléments affichés
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, total);

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Nombre maximum de pages visibles

    if (lastPage <= maxVisible) {
      // Si on a moins de 7 pages, afficher toutes
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ... si nécessaire
      if (currentPage <= 4) {
        // Début: 1, 2, 3, 4, 5, ..., last
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      } else if (currentPage >= lastPage - 3) {
        // Fin: 1, ..., last-4, last-3, last-2, last-1, last
        pages.push(1);
        pages.push('...');
        for (let i = lastPage - 4; i <= lastPage; i++) {
          pages.push(i);
        }
      } else {
        // Milieu: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      }
    }

    return pages;
  };

  if (lastPage <= 1) {
    return null; // Ne pas afficher la pagination s'il n'y a qu'une page
  }

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4",
      className
    )}>
      {/* Informations sur les éléments */}
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Affichage de <span className="font-medium">{startItem}</span> à{' '}
        <span className="font-medium">{endItem}</span> sur{' '}
        <span className="font-medium">{total}</span> éléments
      </div>

      {/* Contrôles de pagination */}
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        {/* Première page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
          title="Première page"
        >
          <FaAngleDoubleLeft className="h-3 w-3" />
          <span className="sr-only">Première page</span>
        </Button>

        {/* Page précédente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
          title="Page précédente"
        >
          <FaChevronLeft className="h-3 w-3" />
          <span className="sr-only">Page précédente</span>
        </Button>

        {/* Numéros de pages */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === 'number' ? (
                <Button
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "h-8 w-8 p-0",
                    page === currentPage && "pointer-events-none"
                  )}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </Button>
              ) : (
                <span className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
                  …
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Page suivante */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="h-8 w-8 p-0"
          title="Page suivante"
        >
          <FaChevronRight className="h-3 w-3" />
          <span className="sr-only">Page suivante</span>
        </Button>

        {/* Dernière page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(lastPage)}
          disabled={currentPage === lastPage}
          className="h-8 w-8 p-0"
          title="Dernière page"
        >
          <FaAngleDoubleRight className="h-3 w-3" />
          <span className="sr-only">Dernière page</span>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;