!(async () => {
  const currentScript = document.currentScript
  const path = currentScript.getAttribute('path')
  const input = _$('s-txt')
  const wrap = _$('s-wrap')

  const response = await fetch(path)
  const datas = (await response.json()).map((item) => {
    // 转换编码
    item.content = ZLStringDecompress(item.content)
    return item
  })
  input.addEventListener('input', () => {
    const value = input.value.trim()
    const keywords = value.split(/[\s\-]+/)

    wrap.innerHTML = ''
    const cdf = document.createDocumentFragment()

    datas.forEach(ele => {
      var dataTitle = ele.title.trim()
      var dataContent = ele.content
        .trim()
        .replace(/<[^>]+>/g, '')
        .toLowerCase()
      var dataUrl = ele.url.startsWith('/') ? ele.url : '/' + ele.url
      // 出现位置 切片用
      var indexTitle = -1
      var indexContent = -1
      // 搜索历史
      if (!keywords[0]) {

      }
      // 有搜索结果的情况下
      if (dataContent && keywords[0]) {
        keywords.forEach((keyword, i) => {
          indexTitle = dataTitle.indexOf(keyword)
          indexContent = dataContent.indexOf(keyword)
          // no result
          if (indexTitle < 0 && indexContent < 0) {
            return
          } else {
            // highlight keywords
            var reg = new RegExp(`(${keyword})`, 'gi')
            var key = '<span class="s-key">$1</span>'
            dataTitle = dataTitle.replace(reg, key)

            var start = indexContent - 10
            var end = indexContent + 50
            var matchContent = (dataContent.substring(start, end)).replace(reg, key)
            const a = document.createElement('a')
            const p = document.createElement('div')
            const title = document.createElement('span')
            const content = document.createElement('span')
            a.href = dataUrl
            a.addEventListener('click', () => {
              document.body.classList.remove('search')
            })
            a.className = "s-item"
            title.className = "s-res-tit"
            content.className = "s-res-con"
            title.innerHTML = dataTitle
            content.innerHTML = matchContent + "..."
            p.appendChild(title)
            p.appendChild(content)
            a.appendChild(p)
            cdf.appendChild(a)
          }
        })
      }
    })
    wrap.appendChild(cdf)

    var num = 0
    window.addEventListener("keydown", e => {
      if (num > wrap.childNodes.length) num = 0
      if (e.altKey && (e.code === "KeyJ" || e.keyCode === 74)) {
        if (num < wrap.childNodes.length) num++
        wrap.childNodes[num - 1].focus()
      }
      if (e.altKey && (e.code === "KeyK" || e.keyCode === 75)) {
        if (num > 1) num--
        wrap.childNodes[num - 1].focus()
      }
      if (e.code === "Escape" || e.keyCode === 27) {
        input.focus()
      }
    })
  })

  function ZLStringDecompress(o) { const i = String.fromCharCode, t = o.length, n = 32768; if (!o) return ""; var a, s, e, r, p, h, c, l = [], d = 4, f = 4, v = 3, w = "", u = [], x = { val: o.charCodeAt(0), position: n, index: 1 }; for (a = 0; a < 3; a += 1)l[a] = a; for (e = 0, p = Math.pow(2, 2), h = 1; h != p;)r = x.val & x.position, x.position >>= 1, 0 == x.position && (x.position = n, x.val = o.charCodeAt(x.index++)), e |= (r > 0 ? 1 : 0) * h, h <<= 1; switch (next = e) { case 0: for (e = 0, p = Math.pow(2, 8), h = 1; h != p;)r = x.val & x.position, x.position >>= 1, 0 == x.position && (x.position = n, x.val = o.charCodeAt(x.index++)), e |= (r > 0 ? 1 : 0) * h, h <<= 1; c = i(e); break; case 1: for (e = 0, p = Math.pow(2, 16), h = 1; h != p;)r = x.val & x.position, x.position >>= 1, 0 == x.position && (x.position = n, x.val = o.charCodeAt(x.index++)), e |= (r > 0 ? 1 : 0) * h, h <<= 1; c = i(e); break; case 2: return "" }for (l[3] = c, s = c, u.push(c); ;) { if (x.index > t) return ""; for (e = 0, p = Math.pow(2, v), h = 1; h != p;)r = x.val & x.position, x.position >>= 1, 0 == x.position && (x.position = n, x.val = o.charCodeAt(x.index++)), e |= (r > 0 ? 1 : 0) * h, h <<= 1; switch (c = e) { case 0: for (e = 0, p = Math.pow(2, 8), h = 1; h != p;)r = x.val & x.position, x.position >>= 1, 0 == x.position && (x.position = n, x.val = o.charCodeAt(x.index++)), e |= (r > 0 ? 1 : 0) * h, h <<= 1; l[f++] = i(e), c = f - 1, d--; break; case 1: for (e = 0, p = Math.pow(2, 16), h = 1; h != p;)r = x.val & x.position, x.position >>= 1, 0 == x.position && (x.position = n, x.val = o.charCodeAt(x.index++)), e |= (r > 0 ? 1 : 0) * h, h <<= 1; l[f++] = i(e), c = f - 1, d--; break; case 2: return u.join("") }if (0 == d && (d = Math.pow(2, v), v++), l[c]) w = l[c]; else { if (c !== f) return null; w = s + s.charAt(0) } u.push(w), l[f++] = s + w.charAt(0), s = w, 0 == --d && (d = Math.pow(2, v), v++) } }
})()