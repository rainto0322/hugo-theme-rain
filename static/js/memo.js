class Memo {
  constructor(option) {
    this.el = document.querySelector(option.el)
    this.url = option.url
    this.tags = option.tags || {}
    this.img = option.img ? `<img src="${option.img}">` : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24px" height="30px" fill="#333"><rect x="0" y="0" width="4" height="15"><animate attributeName="opacity" values="1;.2;1" begin="0s" dur="0.6s" repeatCount="indefinite"></animate></rect><rect x="10" y="0" width="4" height="15"><animate attributeName="opacity" values="1;.2;1" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animate></rect><rect x="20" y="0" width="4" height="15"><animate attributeName="opacity" values="1;.2;1" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animate></rect></svg>'
    this.currentPage = 0
    this.init()
  }

  $(e) {
    return this.el.querySelector(e)
  }

  T(t) {
    const i = new Date(t),
      [e, n, a, s, d] = [i.getFullYear(), String(i.getMonth() + 1).padStart(2, "0"), String(i.getDate()).padStart(2, "0"), String(i.getHours()).padStart(2, "0"), String(i.getMinutes()).padStart(2, "0")];
    return `${e}-${n}-${a} ${s}:${d}`
  }

  create(e) {
    return document.createElement(e)
  }

  async init() {
    const main = `<div id="memo-cont"></div><div id="memo-more" style="text-align:center;padding:2em"></div>`
    this.el.innerHTML = main
    this.$('#memo-more').innerHTML = this.img
    this.FD()
  }

  async FD() {
    const response = await fetch(`${this.url}/memo/0/${this.currentPage}/10`)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    this.RD(data);
  }

  RD(params) {
    const { data, max } = params
    const fragment = document.createDocumentFragment();

    for (const item of data) {
      let { body, date, tag } = item
      const memoItem = this.create('div')
      memoItem.className = 'm-item'

      this.tags[tag] ? tag = this.tags[tag] : tag = '未分類'
      const memoContent = `<div class="i-cont">${body}</div><div class="i-meta"><time datetime="${date}">${this.T(date)}</time></div>`
      memoItem.innerHTML = memoContent
      fragment.appendChild(memoItem)
    }
    const more=this.$('#memo-more')

    if (this.currentPage + 1 < max) {
      const loadMoreButton = this.create('div');
      loadMoreButton.textContent = 'ʕ•ᴥ•ʔ Click me to load more.';
      loadMoreButton.addEventListener('click', () => {
        more.innerHTML = this.img
        this.loadMore()
      });
      more.innerHTML = ''
      more.appendChild(loadMoreButton);
    } else {
      more.innerHTML = "૮₍•́₃•̀₎ა Really not a drop left."
    }

    this.$('#memo-cont').appendChild(fragment);
  }

  loadMore() {
    this.currentPage += 1;
    this.FD();
  }
}