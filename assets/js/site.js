
const BOOKS = window.IPT_BOOKS || [];
const inPages = location.pathname.includes('/pages/');
const ROOT = inPages ? '../' : '';
const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);

function getCart(){return JSON.parse(localStorage.getItem('ipt_v3_cart')||'[]')}
function setCart(v){localStorage.setItem('ipt_v3_cart',JSON.stringify(v));updateCounters()}
function getWish(){return JSON.parse(localStorage.getItem('ipt_v3_wish')||'[]')}
function setWish(v){localStorage.setItem('ipt_v3_wish',JSON.stringify(v));updateCounters()}
function updateCounters(){
  const c=getCart().reduce((s,x)=>s+x.qty,0), w=getWish().length;
  document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=c);
  document.querySelectorAll('[data-wish-count]').forEach(e=>e.textContent=w);
}
function toast(text){
  let t=document.querySelector('.toast'); if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
  t.textContent=text;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1700)
}
function addCart(id){
  const c=getCart(), f=c.find(x=>x.id===id); f?f.qty++:c.push({id,qty:1}); setCart(c); toast('Added to cart');
  if(document.body.dataset.page==='cart')renderCart()
}
function toggleWish(id){
  let w=getWish(); w=w.includes(id)?w.filter(x=>x!==id):[...w,id]; setWish(w);
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(b=>b.classList.toggle('active',w.includes(id)));
  toast(w.includes(id)?'Saved to wishlist':'Removed from wishlist')
}
function card(b){
 return `<article class="book">
  <a href="${ROOT}pages/book.html?id=${b.id}">
   <div class="book-cover ${b.cover}"><span class="tag">${b.badge}</span><small>${b.category}</small><b>${b.title}</b></div>
  </a>
  <div class="book-body">
   <span class="book-format">${b.format}</span>
   <a href="${ROOT}pages/book.html?id=${b.id}"><h3>${b.title}</h3></a>
   <div class="book-author">${b.author}</div>
   <div class="book-meta"><span class="price">${money(b.price)}</span><span class="rating">★ ${b.rating}</span></div>
   <div class="book-actions"><button class="btn" data-add="${b.id}">Add to Cart</button><button class="wishbtn ${getWish().includes(b.id)?'active':''}" data-wish="${b.id}">♡</button></div>
  </div></article>`
}
function bindCards(){
 document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>addCart(b.dataset.add));
 document.querySelectorAll('[data-wish]').forEach(b=>b.onclick=()=>toggleWish(b.dataset.wish))
}
function renderRow(id,start,count){
 const e=document.getElementById(id);if(!e)return;e.innerHTML=BOOKS.slice(start,start+count).map(card).join('');bindCards()
}
function renderShop(){
 const grid=document.getElementById('shopbooks'); if(!grid)return;
 const q=document.getElementById('shopsearch'),sort=document.getElementById('sort'),checks=[...document.querySelectorAll('[data-cat]')],count=document.getElementById('resultcount');
 const run=()=>{
  let a=[...BOOKS],term=(q.value||'').toLowerCase().trim(),cats=checks.filter(x=>x.checked).map(x=>x.value);
  if(term)a=a.filter(b=>(b.title+' '+b.author+' '+b.category+' '+b.format).toLowerCase().includes(term));
  if(cats.length)a=a.filter(b=>cats.includes(b.category));
  if(sort.value==='rating')a.sort((x,y)=>y.rating-x.rating);
  if(sort.value==='low')a.sort((x,y)=>x.price-y.price);
  if(sort.value==='high')a.sort((x,y)=>y.price-x.price);
  if(sort.value==='title')a.sort((x,y)=>x.title.localeCompare(y.title));
  count.textContent=`${a.length} book${a.length===1?'':'s'}`;
  grid.innerHTML=a.length?a.map(card).join(''):'<div class="empty" style="grid-column:1/-1"><h3>No books found</h3><p>Try another search or category.</p></div>';bindCards()
 };
 q.oninput=run;sort.onchange=run;checks.forEach(x=>x.onchange=run);run()
}
function renderProduct(){
 const e=document.getElementById('product'); if(!e)return;
 const id=new URLSearchParams(location.search).get('id')||BOOKS[0].id,b=BOOKS.find(x=>x.id===id)||BOOKS[0];
 document.title=b.title+' | IPTransit-FR';
 e.innerHTML=`<div class="product-layout"><div class="product-cover-wrap"><div class="book-cover ${b.cover}"><span class="tag">${b.badge}</span><small>${b.category}</small><b>${b.title}</b></div></div>
 <div class="product-info"><span class="category">${b.category}</span><h1>${b.title}</h1><p style="color:var(--muted)">by <b>${b.author}</b></p><div class="rating">★★★★★ &nbsp; ${b.rating}/5</div>
 <div class="product-price">${money(b.price)}</div><p class="desc">A carefully selected IPTransit-FR title for readers looking for engaging ideas, memorable storytelling, and a polished reading experience.</p>
 <div class="meta-grid"><div class="meta"><span>Format</span><b>${b.format}</b></div><div class="meta"><span>Language</span><b>English</b></div><div class="meta"><span>Availability</span><b>In Stock</b></div><div class="meta"><span>Shipping</span><b>Calculated at checkout</b></div></div>
 <div class="btnrow"><button class="btn" id="padd">Add to Cart</button><button class="btn outline" id="pwish">${getWish().includes(b.id)?'Saved to Wishlist':'Save to Wishlist'}</button></div></div></div>`;
 document.getElementById('padd').onclick=()=>addCart(b.id);document.getElementById('pwish').onclick=()=>{toggleWish(b.id);renderProduct()}
}
function renderCart(){
 const list=document.getElementById('cartlist'),sum=document.getElementById('summary');if(!list||!sum)return;
 const c=getCart();if(!c.length){list.innerHTML='<div class="empty"><h3>Your cart is empty</h3><p>Browse the catalog and add your next read.</p><a class="btn" href="shop.html">Browse Books</a></div>';sum.innerHTML='<h3>Order Summary</h3><div class="sum-row total"><span>Total</span><span>$0.00</span></div>';return}
 const d=c.map(i=>({...i,b:BOOKS.find(x=>x.id===i.id)})).filter(x=>x.b);
 list.innerHTML=d.map(x=>`<div class="cart-item"><div class="mini-cover ${x.b.cover}">${x.b.title}</div><div><h3 style="margin-bottom:5px">${x.b.title}</h3><p style="font-size:12px;color:var(--muted)">${x.b.author} · ${x.b.format}</p><b>${money(x.b.price)}</b></div><div><div class="qty"><button data-dec="${x.b.id}">−</button><b>${x.qty}</b><button data-inc="${x.b.id}">+</button></div><button class="btn outline" data-remove="${x.b.id}" style="padding:7px 9px;font-size:10px;margin-top:9px;color:#b42318">Remove</button></div></div>`).join('');
 const sub=d.reduce((s,x)=>s+x.b.price*x.qty,0),ship=sub>=50?0:5.95,total=sub+ship;
 sum.innerHTML=`<h3>Order Summary</h3><div class="sum-row"><span>Subtotal</span><b>${money(sub)}</b></div><div class="sum-row"><span>Estimated shipping</span><b>${ship?money(ship):'Free'}</b></div><div class="sum-row"><span>Taxes</span><b>At checkout</b></div><div class="sum-row total"><span>Total</span><span>${money(total)}</span></div><button class="btn full" id="checkout" style="margin-top:12px">Proceed to Checkout</button><p style="font-size:10px;color:var(--muted);line-height:1.5;margin:10px 0 0">Demo storefront. Live payments are not connected yet.</p>`;
 document.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{const c=getCart(),i=c.find(x=>x.id===b.dataset.inc);i.qty++;setCart(c);renderCart()});
 document.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{let c=getCart(),i=c.find(x=>x.id===b.dataset.dec);i.qty--;c=c.filter(x=>x.qty>0);setCart(c);renderCart()});
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{setCart(getCart().filter(x=>x.id!==b.dataset.remove));renderCart();toast('Removed from cart')});
 document.getElementById('checkout').onclick=()=>toast('Checkout integration comes in a production version')
}
function forms(){document.querySelectorAll('[data-demo-form]').forEach(f=>f.onsubmit=e=>{e.preventDefault();f.reset();toast(f.dataset.message||'Thank you!')})}
function globalSearch(){const f=document.getElementById('globalSearchForm');if(!f)return;f.onsubmit=e=>{e.preventDefault();const q=document.getElementById('globalSearch').value.trim();location.href=ROOT+'pages/shop.html?q='+encodeURIComponent(q)}}
function applyQuery(){const q=new URLSearchParams(location.search).get('q');const s=document.getElementById('shopsearch');if(q&&s){s.value=q;s.dispatchEvent(new Event('input'))}}
document.addEventListener('DOMContentLoaded',()=>{updateCounters();renderRow('bestsellers',0,5);renderRow('newreleases',5,5);renderShop();renderProduct();renderCart();forms();globalSearch();applyQuery()})
