
const BOOKS = [{"id": "silent-horizon", "title": "The Silent Horizon", "author": "Amelia Hart", "category": "Fiction", "price": 18.99, "rating": 4.8, "badge": "Bestseller", "cover": "c1", "desc": "A reflective literary journey about ambition, distance, and the choices that shape a life."}, {"id": "build-better", "title": "Build Better", "author": "Marcus Reed", "category": "Business", "price": 22.0, "rating": 4.7, "badge": "Editor's Pick", "cover": "c2", "desc": "A practical guide to building stronger teams, clearer systems, and sustainable organizations."}, {"id": "future-systems", "title": "Future Systems", "author": "Nora Kim", "category": "Technology", "price": 24.5, "rating": 4.9, "badge": "New", "cover": "c3", "desc": "An accessible look at artificial intelligence, automation, digital infrastructure, and what comes next."}, {"id": "small-steps", "title": "Small Steps", "author": "Daniel Brooks", "category": "Personal Growth", "price": 16.75, "rating": 4.6, "badge": "Popular", "cover": "c4", "desc": "A practical framework for creating meaningful progress through simple daily actions."}, {"id": "atlas-of-ideas", "title": "Atlas of Ideas", "author": "Sofia Bennett", "category": "Education", "price": 19.9, "rating": 4.5, "badge": "Recommended", "cover": "c5", "desc": "A visual introduction to influential ideas across science, culture, philosophy, and history."}, {"id": "moonlight-library", "title": "The Moonlight Library", "author": "Clara Wells", "category": "Fiction", "price": 17.25, "rating": 4.8, "badge": "Staff Favorite", "cover": "c6", "desc": "A warm story about an old library, hidden letters, and unexpected second chances."}, {"id": "money-with-purpose", "title": "Money With Purpose", "author": "Ethan Cole", "category": "Business", "price": 21.4, "rating": 4.7, "badge": "Trending", "cover": "c7", "desc": "A clear approach to personal finance, intentional spending, saving, and long-term planning."}, {"id": "learning-loop", "title": "The Learning Loop", "author": "Maya Singh", "category": "Education", "price": 18.4, "rating": 4.6, "badge": "New", "cover": "c8", "desc": "Learn how feedback, practice, and reflection can turn curiosity into durable knowledge."}];
const inPages = location.pathname.includes('/pages/');
const ROOT = inPages ? '../' : '';
const money = v => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);

function cart(){return JSON.parse(localStorage.getItem('ipt_cart_v2')||'[]')}
function saveCart(v){localStorage.setItem('ipt_cart_v2',JSON.stringify(v));counts()}
function wishes(){return JSON.parse(localStorage.getItem('ipt_wish_v2')||'[]')}
function saveWishes(v){localStorage.setItem('ipt_wish_v2',JSON.stringify(v));counts()}
function counts(){
  const c=cart().reduce((s,i)=>s+i.qty,0), w=wishes().length;
  document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=c);
  document.querySelectorAll('[data-wish-count]').forEach(e=>e.textContent=w);
}
function toast(msg){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('show');clearTimeout(window.__t);window.__t=setTimeout(()=>t.classList.remove('show'),1800)
}
function add(id){
  const c=cart(), f=c.find(x=>x.id===id); f?f.qty++:c.push({id,qty:1});
  saveCart(c);toast('Added to cart');
  if(document.body.dataset.page==='cart')renderCart();
}
function wish(id){
  let w=wishes(); w.includes(id)?w=w.filter(x=>x!==id):w.push(id); saveWishes(w); toast(w.includes(id)?'Saved to wishlist':'Removed from wishlist');
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(b=>b.classList.toggle('active',w.includes(id)))
}
function card(b){
  return `<article class="bookcard">
    <a href="${ROOT}pages/book.html?id=${b.id}"><div class="cover ${b.cover}"><small>${b.category}</small><b>${b.title}</b></div></a>
    <div class="cardbody"><div class="cardhead"><div><a href="${ROOT}pages/book.html?id=${b.id}"><h3>${b.title}</h3></a><p>${b.author}</p></div><span class="pill">${b.badge}</span></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><span class="price">${money(b.price)}</span><span class="rating">★ ${b.rating}</span></div>
    <div class="cardactions"><button class="btn" data-add="${b.id}">Add to Cart</button><button class="wish ${wishes().includes(b.id)?'active':''}" data-wish="${b.id}" aria-label="Save">♡</button></div></div>
  </article>`
}
function bind(){
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>add(b.dataset.add));
  document.querySelectorAll('[data-wish]').forEach(b=>b.onclick=()=>wish(b.dataset.wish));
}
function featured(){
  const e=document.querySelector('#featured'); if(!e)return; e.innerHTML=BOOKS.slice(0,4).map(card).join('');bind()
}
function shop(){
  const grid=document.querySelector('#shopbooks'); if(!grid)return;
  const q=document.querySelector('#search'),sort=document.querySelector('#sort'),checks=[...document.querySelectorAll('[data-cat]')],count=document.querySelector('#resultcount');
  const run=()=>{
    let a=[...BOOKS]; const term=(q.value||'').toLowerCase().trim(), cats=checks.filter(x=>x.checked).map(x=>x.value);
    if(term)a=a.filter(b=>(b.title+' '+b.author+' '+b.category).toLowerCase().includes(term));
    if(cats.length)a=a.filter(b=>cats.includes(b.category));
    if(sort.value==='price-low')a.sort((x,y)=>x.price-y.price);
    if(sort.value==='price-high')a.sort((x,y)=>y.price-x.price);
    if(sort.value==='rating')a.sort((x,y)=>y.rating-x.rating);
    if(sort.value==='title')a.sort((x,y)=>x.title.localeCompare(y.title));
    count.textContent=`${a.length} book${a.length===1?'':'s'}`;
    grid.innerHTML=a.length?a.map(card).join(''):'<div class="empty" style="grid-column:1/-1"><h3>No books found</h3><p>Try another search or filter.</p></div>';
    bind()
  };
  q.oninput=run;sort.onchange=run;checks.forEach(x=>x.onchange=run);run()
}
function product(){
  const e=document.querySelector('#product');if(!e)return;
  const id=new URLSearchParams(location.search).get('id')||BOOKS[0].id,b=BOOKS.find(x=>x.id===id)||BOOKS[0];
  document.title=b.title+' | IPTransit-FR';
  e.innerHTML=`<div class="product"><div class="productcover"><div class="cover ${b.cover}"><small>${b.category}</small><b>${b.title}</b></div></div>
  <div class="productinfo"><span class="category">${b.category}</span><h1>${b.title}</h1><p class="author">by <strong>${b.author}</strong></p><span class="rating">★★★★★ &nbsp; ${b.rating} / 5</span>
  <div class="productprice">${money(b.price)}</div><p class="desc">${b.desc}</p>
  <div class="metagrid"><div class="meta"><span>Format</span><b>Paperback</b></div><div class="meta"><span>Language</span><b>English</b></div><div class="meta"><span>Availability</span><b>In Stock</b></div><div class="meta"><span>Shipping</span><b>Calculated at checkout</b></div></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="padd">Add to Cart</button><button class="btn light" id="pwish">${wishes().includes(b.id)?'Saved to Wishlist':'Save to Wishlist'}</button></div></div></div>`;
  document.querySelector('#padd').onclick=()=>add(b.id);document.querySelector('#pwish').onclick=()=>{wish(b.id);product()}
}
function renderCart(){
  const list=document.querySelector('#cartlist'), sum=document.querySelector('#summary');if(!list||!sum)return;
  const c=cart(); if(!c.length){list.innerHTML='<div class="empty"><h3>Your cart is empty</h3><p>Discover your next book and add it to your cart.</p><a class="btn" href="shop.html">Browse Books</a></div>';sum.innerHTML='<h3>Order Summary</h3><div class="sumrow total"><span>Total</span><span>$0.00</span></div>';return}
  const d=c.map(i=>({...i,b:BOOKS.find(x=>x.id===i.id)})).filter(x=>x.b);
  list.innerHTML=d.map(x=>`<div class="cartitem"><div class="minicover ${x.b.cover}">${x.b.title}</div><div><h3>${x.b.title}</h3><p>${x.b.author} · ${x.b.category}</p><b>${money(x.b.price)}</b></div>
  <div><div class="qty"><button data-dec="${x.b.id}">−</button><b>${x.qty}</b><button data-inc="${x.b.id}">+</button></div><button class="btn light" style="margin-top:10px;padding:8px 10px;font-size:11px;color:var(--danger)" data-remove="${x.b.id}">Remove</button></div></div>`).join('');
  const sub=d.reduce((s,x)=>s+x.b.price*x.qty,0),ship=sub>=50?0:5.95,total=sub+ship;
  sum.innerHTML=`<h3>Order Summary</h3><div class="sumrow"><span>Subtotal</span><b>${money(sub)}</b></div><div class="sumrow"><span>Estimated shipping</span><b>${ship?money(ship):'Free'}</b></div><div class="sumrow"><span>Taxes</span><b>At checkout</b></div><div class="sumrow total"><span>Total</span><span>${money(total)}</span></div><button class="btn full" id="checkout" style="margin-top:14px">Proceed to Checkout</button><p style="font-size:11px;color:var(--muted);line-height:1.5;margin:12px 0 0">Demo storefront. Live payment processing is not connected yet.</p>`;
  document.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{const c=cart(),i=c.find(x=>x.id===b.dataset.inc);i.qty++;saveCart(c);renderCart()});
  document.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{let c=cart(),i=c.find(x=>x.id===b.dataset.dec);i.qty--;c=c.filter(x=>x.qty>0);saveCart(c);renderCart()});
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{saveCart(cart().filter(x=>x.id!==b.dataset.remove));renderCart();toast('Removed from cart')});
  document.querySelector('#checkout').onclick=()=>toast('Checkout will be connected in a production version');
}
function initForms(){
  document.querySelectorAll('[data-demo-form]').forEach(f=>f.onsubmit=e=>{e.preventDefault();f.reset();toast(f.dataset.message||'Thank you!')})
}
function nav(){
  const b=document.querySelector('#menubtn'),n=document.querySelector('#navlinks'); if(b)b.onclick=()=>n.classList.toggle('open')
}
document.addEventListener('DOMContentLoaded',()=>{counts();nav();initForms();featured();shop();product();renderCart()})
