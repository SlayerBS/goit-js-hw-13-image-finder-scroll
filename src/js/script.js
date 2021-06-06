import getRefs from './get-refs';
import markup from './markup';
import notify from './error';
import ApiService from './apiService';
import { onGalleryContainerClick } from './components/basic-lightbox';

const refs = getRefs();

const apiService = new ApiService();
const bottomElement = document.querySelector('.bottom-element');

refs.searchForm.addEventListener('submit', onSearch);
refs.galleryContainer.addEventListener('click', onGalleryContainerClick);

function onSearch(elem) {
  elem.preventDefault();
  apiService.query = elem.currentTarget.elements.query.value;

  if (apiService.query === '') {
    return notify.errorMessage(`Введите поисковый запрос!`);
  }
  apiService.resetPage();
  markup.clearMarkup();
  fetchImages();
}

function fetchImages() {
  const imageRes = apiService.fetchImages().then(data => {
    markup.imageMarkup(data);
    const responseStatus = apiService.outputResponse;
    outputResponseStatus(responseStatus);
    if (!data.length) {
      notify.errorMessage(`Ничего не нашли(`);
      return;
    } else if (data.length === 12) {
    } else {
      notify.noticeMessage(`Это все по поисковому запросу "${apiService.query}"`);
    }
  });
}

const onEntries = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiService.query !== '') {
      console.log('Hello');
      fetchImages();
    }
  });
};

const options = {
  rootMargin: '100px',
};
const observer = new IntersectionObserver(onEntries, options);

observer.observe(refs.sentinel);

const outputResponseStatus = responseStatus => {
  console.log(responseStatus);

  if (responseStatus >= 200 && responseStatus < 300) {
    notify.successMessage(`Статус запроса ${responseStatus}`);
    return;
  }
  if (responseStatus >= 500 && responseStatus < 600) {
    notify.errorMessage(`Ошибка! Статус HTTP запроса ${responseStatus}`);
    return;
  }
};
