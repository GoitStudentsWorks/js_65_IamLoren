import Pagination from 'tui-pagination';
import axios from 'axios';
import 'tui-pagination/dist/tui-pagination.css';
// import icon from '../../images/icons.svg';
import { getAllProducts, getProductsByQuery } from './api.js';
import { createProductCard, renderMarkup } from './templates/cards.js';
import { load, save } from './localStorage.js';
const BASE_URL = 'https://food-boutique.b.goit.study/api/products';

const productsListGeneral = document.querySelector('.products-list-general');
const container = document.querySelector('#tui-pagination-container');

const options = {
  itemsPerPage: 1,
  visiblePages: 5,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" aria-label="pagination-page link" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton: `<a href="#" aria-label="pagination-move link" class="icon tui-page-btn tui-{{type}}">
      <span class="tui-ico-{{type}}">{{type}}>
      </span>
      </a>`,
    disabledMoveButton: `<span class="tui-page-btn tui-is-disabled tui-{{type}}">
      <span class="tui-ico-{{type}}">{{type}}>
      </span>
      </span>`,
    moreButton:
      '<a href="#" aria-label="pagination-more link" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};

const pagination = new Pagination(container, options);
let qpage = pagination.getCurrentPage();

console.log(qpage);
const getAllProducts = async params => {
  try {
    const { keyword, category, page, limit, sort } = params;
    const response = await axios.get(
      `${BASE_URL}?keyword=${keyword}&category=${category}&page=${page}&limit=${limit}&${sort}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const onRenderPage = async () => {
  try {
    // робимо запит
    const allProducts = await getAllProducts({ page: qpage });

    console.log('Product', allProducts, '0', allProducts.results);
    renderMarkup(allProducts.results, 'general', productsListGeneral);
    // Розмітка
    pagination.reset(allProducts.totalPages);
    container.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
};

const createUserPagination = async event => {
  const currentPage = event.page;
  getAllProducts.page = currentPage;
  console.log(currentPage);

  try {
    const allProducts = await getAllProducts();
    console.log('qpage', allProducts.results);
    qpage = pagination.getCurrentPage();
    console.log(qpage);

    renderMarkup(allProducts.results, 'general', productsListGeneral);
  } catch (err) {
    console.log(err);
  }
};
pagination.on('afterMove', createUserPagination);

document.addEventListener('DOMContentLoaded', onRenderPage);
