import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton(currentPage, 'next');
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton(currentPage, 'prev');
    }

    // In between pages
    if (currentPage < numPages) {
      const markup1 = this._generateMarkupButton(currentPage, 'next');
      const markup2 = this._generateMarkupButton(currentPage, 'prev');
      return markup1 + markup2;
    }

    // Page 1, and there are not other pages
    if (currentPage === 1 && numPages === 1) {
      return '';
    }
  }

  _generateMarkupButton(page, direction) {
    const goToPage = direction === 'prev' ? page - 1 : page + 1;
    const directionClass = direction === 'prev' ? 'prev' : 'next';
    const directionIcon = direction === 'prev' ? 'left' : 'right';

    return `
      <button data-goto="${goToPage}" class="btn--inline pagination__btn--${directionClass}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${directionIcon}"></use>
        </svg>
        <span>Page ${goToPage}</span>
      </button>
    `;
  }
}

export default new PaginationView();
