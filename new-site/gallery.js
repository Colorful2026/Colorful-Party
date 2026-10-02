const assetBase = new URL('../uploads/', document.currentScript.src);
const categories = [
  { id: 'all', en: 'All', zh: '全部' },
  { id: 'proposals', en: 'Proposals', zh: '求婚' },
  { id: 'weddings', en: 'Weddings', zh: '婚礼' },
  { id: 'events', en: 'Celebrations', zh: '庆典' },
  { id: 'portraits', en: 'Portraits', zh: '人像' },
  { id: 'backdrops', en: 'Backdrops', zh: '布景' },
  { id: 'dresses', en: 'Gowns', zh: '礼服' }
];

// Selected original photographs; the hanfu sword portrait was removed at the owner’s request.
const photos = [
  ['proposals', 'E51BB611-C2B8-48FE-ACF8-464E5DBF6C53.PNG', 'The moment', 'Couple kissing at a lit heart-shaped floral arch during a proposal'],
  ['proposals', 'proposal-backyard-arch.webp', 'Backyard setup', 'Backyard proposal setup with a heart-shaped floral arch, white aisle runner and flowers'],
  ['proposals', 'IMG_6674.jpeg', 'Aisle and frame', 'Round floral-frame proposal aisle setup'],
  ['proposals', 'IMG_6692.JPEG', 'Evening reveal', 'Round floral-frame arch lit at night'],
  ['proposals', 'IMG_7397.JPG', 'Neon signage', 'Illuminated MARRY ME sign at a night proposal setup'],
  ['proposals', 'IMG_6680.JPEG', 'On location', 'Production crew filming a bride walking toward a floral proposal frame'],
  ['weddings', 'IMG_7399.JPG', 'First dance', 'Couple dancing amid spark fountains and guests'],
  ['weddings', 'IMG_7318.jpeg', 'Banquet hall', 'White and gold chairs beneath a floral arch in a banquet hall'],
  ['weddings', 'IMG_7444.JPG', 'Bridesmaid sets', 'Four women in matching ivory and gold occasion wear'],
  ['events', 'outdoor-banquet.webp', 'Outdoor banquet', 'Outdoor banquet with guests along a red aisle runner'],
  ['events', '3D84AA2F-F883-4D35-8320-F1F17409EF76.PNG', 'Fog and bubbles', 'Couple dancing amid fog and bubbles at a reception'],
  ['events', 'twin-monkey-couplets.webp', 'Twin Monkey bring good fortune', 'Two Monkey King performers holding auspicious couplets'],
  ['events', 'robot-warrior-suits.webp', 'Robot warrior suits', 'Red and gold warrior costume display'],
  ['portraits', 'family-portrait-wide.webp', 'Family · Studio', 'Extended family in red qipao photographed in the studio'],
  ['portraits', 'family-portrait.webp', 'Three generations', 'Three generations of family in red qipao'],
  ['portraits', 'IMG_6098.JPG', 'Qipao · Studio gold', 'Studio portrait of a woman in a red lace qipao'],
  ['backdrops', 'IMG_3159.jpeg', 'Draped and uplit', 'Draped studio backdrop with pearl strands and warm light'],
  ['backdrops', 'IMG_3158.jpeg', 'Head table styling', 'Styled reception table in front of a draped backdrop'],
  ['backdrops', 'IMG_7110.jpeg', 'Candelabra stands', 'Gold crystal candelabra stands topped with white roses'],
  ['backdrops', 'flower-stands-crystal.webp', 'Crystal flower stands', 'Gold flower stands with crystal strands and white roses'],
  ['dresses', 'IMG_7435.JPG', 'Mermaid · Lace', 'White lace mermaid wedding gown on a mannequin'],
  ['dresses', '52EAF3F6-A7C1-4210-964B-70D1BB30FFC8.PNG', 'A-line · Appliqué', 'A-line gown with floral lace appliqué'],
  ['dresses', '0882F294-9BB9-41CE-80F2-5AC66A2D1117.PNG', 'Ballgown', 'Model wearing an off-shoulder beaded ballgown'],
  ['dresses', 'b49d30994ce9d22fd5eb2d177a3355.JPG', 'Evening · Beaded', 'Black beaded mermaid evening gown on display'],
  ['dresses', 'showroom-black-gown.webp', 'Column gown · Showroom', 'Client in a black beaded column gown in the showroom'],
  ['dresses', 'bff0c3c1733cad648a1ff6c6ef96a6.JPG', 'Qipao · Gold silk', 'Gold silk cheongsam with black lace trim'],
  ['dresses', 'IMG_3043.jpeg', 'Red silk · Embroidered', 'Red silk embroidered gown on a mannequin']
];

const filterHost = document.getElementById('gallery-filters');
const grid = document.getElementById('gallery-grid');
const results = document.getElementById('gallery-results');
let language = 'en';
let filter = 'all';
const viewer = document.getElementById('photo-viewer');
let viewerPhotos = [];
let viewerIndex = 0;

function updateViewer() {
  const [categoryId, filename, caption, alt] = viewerPhotos[viewerIndex];
  const image = document.getElementById('viewer-image');
  image.src = new URL(encodeURIComponent(filename), assetBase).href;
  image.alt = alt;
  document.getElementById('viewer-caption').textContent = categories.find(category => category.id === categoryId)[language] + ' · ' + caption;
  document.getElementById('viewer-count').textContent = `${viewerIndex + 1} / ${viewerPhotos.length}`;
}

function movePhoto(direction) {
  viewerIndex = (viewerIndex + direction + viewerPhotos.length) % viewerPhotos.length;
  updateViewer();
}

document.getElementById('viewer-close').addEventListener('click', () => viewer.close());
document.getElementById('viewer-prev').addEventListener('click', () => movePhoto(-1));
document.getElementById('viewer-next').addEventListener('click', () => movePhoto(1));
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    movePhoto(event.key === 'ArrowLeft' ? -1 : 1);
  }
});

function render() {
  filterHost.replaceChildren();
  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-filter';
    button.setAttribute('aria-pressed', String(filter === category.id));
    const count = category.id === 'all' ? photos.length : photos.filter(photo => photo[0] === category.id).length;
    button.append(document.createTextNode(category[language] + ' '));
    const number = document.createElement('span');
    number.textContent = count;
    button.append(number);
    button.addEventListener('click', () => {
      filter = category.id;
      render();
      filterHost.querySelector('[aria-pressed="true"]').focus();
    });
    filterHost.append(button);
  }

  const visible = filter === 'all' ? photos : photos.filter(photo => photo[0] === filter);
  results.textContent = language === 'zh' ? `显示 ${visible.length} 张作品照片` : `Showing ${visible.length} photographs`;
  grid.replaceChildren();
  for (const [index, [categoryId, filename, caption, alt]] of visible.entries()) {
    const figure = document.createElement('figure');
    figure.className = 'gallery-card';
    const image = document.createElement('img');
    image.src = new URL(encodeURIComponent(filename), assetBase).href;
    image.alt = alt;
    image.loading = 'lazy';
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'gallery-open';
    open.setAttribute('aria-label', (language === 'zh' ? '查看大图：' : 'View photograph: ') + caption);
    open.setAttribute('aria-haspopup', 'dialog');
    open.append(image);
    open.addEventListener('click', () => {
      viewerPhotos = visible;
      viewerIndex = index;
      updateViewer();
      viewer.showModal();
    });
    const captionEl = document.createElement('figcaption');
    const categoryEl = document.createElement('span');
    categoryEl.textContent = categories.find(category => category.id === categoryId)[language];
    const titleEl = document.createElement('span');
    titleEl.textContent = caption;
    captionEl.append(categoryEl, titleEl);
    figure.append(open, captionEl);
    grid.append(figure);
  }
}

document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
  language = button.dataset.language;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(element => { element.textContent = element.dataset[language]; });
  document.querySelectorAll('[data-language]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  render();
}));

render();
