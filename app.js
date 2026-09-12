
const DATA_PATH = window.location.pathname.includes('/pages/') ? '../data/books.json' : 'data/books.json';
const PAGE_ROOT = window.location.pathname.includes('/pages/') ? '../' : '';

let BOOKS = [];

const money = v => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);

function getCart(){ return JSON.parse(localStorage.getItem('ipt_cart') || '[]'); }
function setCart(cart){ localStorage.setItem('ipt_cart', JSON.stringify(cart)); updateCounts(); }
function getWishlist(){ return JSON.parse(localStorage.getItem('ipt_wishlist') || '[]'); }
function setWishlist(items){ localStorage.setItem('ipt_wishlist', JSON.stringify(items)); updateCounts(); }

function updateCounts(){
  const cartCount = getCart().reduce((n,i)=>n+i.qty,0);
  const wishCount = getWishlist().length;
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cartCount);
  document.querySelectorAll('[data-wish-count]').forEach(el=>el.textContent=wishCount);
}

function toast(message){
  let el = document.querySelector('.toast');
  if(!el){
    el = document.createElement('div');
    el.className='toast';
    document.body.appendChild(el);
  }
  el.textContent=message;
  el.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>el.classList.remove('show'),1800);
}

function addToCart(id, qty=1){
  const cart=getCart();
  const found=cart.find(i=>i.id===id);
  if(found) found.qty += qty;
  else cart.push({id,qty});
  setCart(cart);
  toast('Added to cart');
  if(document.body.dataset.page==='cart') renderCart();
}

function toggleWishlist(id){
  let w=getWishlist();
  if(w.includes(id)){ w=w.filter(x=>x!==id); toast('Removed from wishlist'); }
  else { w.push(id); toast('Saved to wishlist'); }
  setWishlist(w);
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(btn=>btn.classList.toggle('active',w.includes(id)));
}

function bookCard(book){
  const saved=getWishlist().includes(book.id);
  return `
  <article class="book-card" data-book-card data-category="${book.category}" data-title="${(book.title+' '+book.author).toLowerCase()}">
    <a href="${PAGE_ROOT}pages/book.html?id=${book.id}">
      <div class="book-cover ${book.cover}">
        <small>${book.category}</small>
        <b>${book.title}</b>
      </div>
    </a>
    <div class="card-body">
      <div class="card-top">
        <div>
          <a href="${PAGE_ROOT}pages/book.html?id=${book.id}"><h3>${book.title}</h3></a>
          <p>${book.author}</p>
        </div>
        <span class="badge">${book.badge}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="price">${money(book.price)}</span>
        <span class="rating">★ ${book.rating}</span>
      </div>
      <div class="card-actions">
        <button class="btn" data-add="${book.id}">Add to Cart</button>
        <button class="wish-btn ${saved?'active':''}" aria-label="Save to wishlist" data-wish="${book.id}">♡</button>
      </div>
    </div>
  </article>`;
}

function bindCardActions(){
  document.querySelectorAll('[data-add]').forEach(btn=>btn.onclick=()=>addToCart(btn.dataset.add));
  document.querySelectorAll('[data-wish]').forEach(btn=>btn.onclick=()=>toggleWishlist(btn.dataset.wish));
}

function renderFeatured(){
  const el=document.querySelector('#featuredBooks');
  if(!el) return;
  el.innerHTML=BOOKS.slice(0,4).map(bookCard).join('');
  bindCardActions();
}

function renderShop(){
  const grid=document.querySelector('#shopGrid');
  if(!grid) return;

  const search=document.querySelector('#shopSearch');
  const sort=document.querySelector('#sortBooks');
  const checks=[...document.querySelectorAll('[data-category-check]')];

  function apply(){
    let items=[...BOOKS];
    const q=(search?.value||'').trim().toLowerCase();
    const active=checks.filter(c=>c.checked).map(c=>c.value);

    if(q) items=items.filter(b=>(b.title+' '+b.author+' '+b.category).toLowerCase().includes(q));
    if(active.length) items=items.filter(b=>active.includes(b.category));

    const s=sort?.value||'featured';
    if(s==='price-low') items.sort((a,b)=>a.price-b.price);
    if(s==='price-high') items.sort((a,b)=>b.price-a.price);
    if(s==='rating') items.sort((a,b)=>b.rating-a.rating);
    if(s==='title') items.sort((a,b)=>a.title.localeCompare(b.title));

    grid.innerHTML=items.length ? items.map(bookCard).join('') : '<div class="empty-state" style="grid-column:1/-1"><h3>No books found</h3><p>Try another search or filter.</p></div>';
    document.querySelector('#resultCount').textContent=`${items.length} book${items.length===1?'':'s'}`;
    bindCardActions();
  }

  search?.addEventListener('input',apply);
  sort?.addEventListener('change',apply);
  checks.forEach(c=>c.addEventListener('change',apply));
  apply();
}

function renderProduct(){
  const el=document.querySelector('#productRoot');
  if(!el) return;
  const id=new URLSearchParams(location.search).get('id') || BOOKS[0]?.id;
  const book=BOOKS.find(b=>b.id===id) || BOOKS[0];
  if(!book) return;

  document.title=`${book.title} | IPTransit-FR`;
  el.innerHTML=`
    <div class="product-layout">
      <div class="product-cover-wrap">
        <div class="book-cover ${book.cover}">
          <small>${book.category}</small>
          <b>${book.title}</b>
        </div>
      </div>
      <div class="product-info">
        <span class="category-label">${book.category}</span>
        <h1>${book.title}</h1>
        <p class="author">by <strong>${book.author}</strong></p>
        <div class="rating">★★★★★ &nbsp; ${book.rating} / 5</div>
        <div class="product-price">${money(book.price)}</div>
        <p class="description">${book.description}</p>
        <div class="meta-table">
          <div class="meta-cell"><span>Format</span><strong>Paperback</strong></div>
          <div class="meta-cell"><span>Language</span><strong>English</strong></div>
          <div class="meta-cell"><span>Availability</span><strong>In Stock</strong></div>
          <div class="meta-cell"><span>Shipping</span><strong>Calculated at checkout</strong></div>
        </div>
        <div class="product-actions">
          <button class="btn" id="productAdd">Add to Cart</button>
          <button class="btn secondary" id="productWish">${getWishlist().includes(book.id)?'Saved to Wishlist':'Save to Wishlist'}</button>
        </div>
      </div>
    </div>`;
  document.querySelector('#productAdd').onclick=()=>addToCart(book.id);
  document.querySelector('#productWish').onclick=()=>{ toggleWishlist(book.id); renderProduct(); };
}

function renderCart(){
  const list=document.querySelector('#cartList');
  const summary=document.querySelector('#cartSummary');
  if(!list || !summary) return;

  const cart=getCart();
  if(!cart.length){
    list.innerHTML=`<div class="empty-state"><h3>Your cart is empty</h3><p>Discover your next book and add it to your cart.</p><a class="btn" href="../pages/shop.html">Browse Books</a></div>`;
    summary.innerHTML=`<h3>Order Summary</h3><div class="summary-row"><span>Subtotal</span><strong>$0.00</strong></div><div class="summary-row total"><span>Total</span><span>$0.00</span></div>`;
    return;
  }

  const details=cart.map(item=>({ ...item, book:BOOKS.find(b=>b.id===item.id)})).filter(x=>x.book);
  list.innerHTML=details.map(({book,qty})=>`
    <div class="cart-item">
      <div class="mini-cover ${book.cover}">${book.title}</div>
      <div class="cart-info">
        <h3>${book.title}</h3>
        <p>${book.author} · ${book.category}</p>
        <strong>${money(book.price)}</strong>
      </div>
      <div>
        <div class="quantity">
          <button data-dec="${book.id}">−</button><strong>${qty}</strong><button data-inc="${book.id}">+</button>
        </div>
        <button class="btn danger" style="margin-top:12px;padding:8px 10px;font-size:12px" data-remove="${book.id}">Remove</button>
      </div>
    </div>`).join('');

  const subtotal=details.reduce((s,i)=>s+i.book.price*i.qty,0);
  const shipping=subtotal>=50?0:5.95;
  const total=subtotal+shipping;
  summary.innerHTML=`
    <h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="summary-row"><span>Estimated shipping</span><strong>${shipping===0?'Free':money(shipping)}</strong></div>
    <div class="summary-row"><span>Taxes</span><strong>Calculated at checkout</strong></div>
    <div class="summary-row total"><span>Total</span><span>${money(total)}</span></div>
    <button class="btn full" id="checkoutBtn" style="margin-top:14px">Proceed to Checkout</button>
    <p style="font-size:11px;color:var(--muted);line-height:1.5;margin:12px 0 0">Demo storefront: payment processing is not connected in Version 1.</p>`;

  document.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{
    const cart=getCart(); const i=cart.find(x=>x.id===b.dataset.inc); i.qty++; setCart(cart); renderCart();
  });
  document.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{
    let cart=getCart(); const i=cart.find(x=>x.id===b.dataset.dec); i.qty--; cart=cart.filter(x=>x.qty>0); setCart(cart); renderCart();
  });
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{
    setCart(getCart().filter(x=>x.id!==b.dataset.remove)); renderCart(); toast('Removed from cart');
  });
  document.querySelector('#checkoutBtn').onclick=()=>toast('Checkout integration will be added in the next version');
}

function mobileNav(){
  const btn=document.querySelector('#menuBtn');
  const nav=document.querySelector('#navLinks');
  btn?.addEventListener('click',()=>nav.classList.toggle('open'));
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

function forms(){
  document.querySelectorAll('[data-demo-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      form.reset();
      toast(form.dataset.message || 'Thanks! Your request has been received.');
    })
  })
}

async function init(){
  mobileNav();
  updateCounts();
  forms();
  try{
    BOOKS=await fetch(DATA_PATH).then(r=>r.json());
  }catch(e){
    console.error(e);
    return;
  }
  renderFeatured();
  renderShop();
  renderProduct();
  renderCart();
}
document.addEventListener('DOMContentLoaded',init);
