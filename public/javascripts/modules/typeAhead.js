import axios from 'axios'
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;
  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    // if there is no value, quit it!
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    axios.get(`/api/search?q=${this.value}`)
      .then(res => {
        console.log('res.data:', res.data);
        if (res.data.length) {
          const html = searchResultsHTML(res.data);
          searchResults.innerHTML = dompurify.sanitize(html);
          return;
        }
        // tell user nothing came back
        searchResults.innerHTML = dompurify.sanitize(`
          <div class="search__result">
            No results for ${this.value} found!
          </div>
        `);
      })
      .catch(err => console.error(err));
  });

  // handle keyboard inputs
  searchInput.on('keyup', (e) => {
    // if they aren't pressing up / down / enter... who cares!
    if (![38, 40, 13].includes(e.which)) return;
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');

    let next;
    if (e.which === 40 && current) { // down
      next = current.nextElementSibling || items[0];
    } else if (e.which === 40) {
      next = items[0];
    } else if (e.which === 38 && current) { // up
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.which === 38) {
      next = items[items.length - 1];
    } else if (e.which === 13  && current.href) {
      window.location = current.href;
      return;
    }

    if (current) {
      current.classList.remove(activeClass);
    }

    next.classList.add(activeClass);
  });
}

export default typeAhead;
