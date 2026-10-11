import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getFirestore, collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

// Firebase console > Project settings > Your apps. Leave placeholders for local demo mode.
const firebaseConfig = {
   apiKey: "AIzaSyCcCOamkYCuiLaEVuWCP6OU2eTquPzxfhc",
  authDomain: "desing3-1bb28.firebaseapp.com",
  projectId: "desing3-1bb28",
  storageBucket: "desing3-1bb28.firebasestorage.app",
  messagingSenderId: "360909142371",
  appId: "1:360909142371:web:81b4647e8bd8440d27bb56",
};
const firebaseConfigured = Boolean(firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_') && firebaseConfig.projectId && !firebaseConfig.projectId.startsWith('YOUR_'));
const LOCAL_KEY = 'demo3_menu_items_v1';

const categoryInfo = {
  all: { ka: 'ყველა', en: 'All', ru: 'Всё' },
  salads: { ka: 'სალათები', en: 'Salads', ru: 'Салаты' },
  mains: { ka: 'ცხელი კერძები', en: 'Main dishes', ru: 'Горячие блюда' },
  soup: { ka: 'წვნიანი', en: 'Soups', ru: 'Супы' },
  bakery: { ka: 'ცომეული', en: 'Bakery', ru: 'Выпечка' },
  wine: { ka: 'ღვინო', en: 'Wine', ru: 'Вино' },
  drinks: { ka: 'სასმელები', en: 'Drinks', ru: 'Напитки' },
  desserts: { ka: 'დესერტი', en: 'Desserts', ru: 'Десерты' }
};

const seedItems = [
  {id:'demo-pkhali',category:'salads',active:true,name:{ka:'ფხალის ასორტი',en:'Pkhali Selection',ru:'Ассорти пхали'},description:{ka:'ისპანახის, ჭარხლისა და ნიგვზის ტრადიციული ქართული ფხალი.',en:'Traditional Georgian pkhali made with spinach, beetroot and walnuts.',ru:'Традиционное грузинское пхали из шпината, свёклы и грецких орехов.'},price:18,image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-salad',category:'salads',active:true,name:{ka:'ქართული სალათი',en:'Georgian Salad',ru:'Грузинский салат'},description:{ka:'მწიფე პომიდორი, კიტრი, მწვანილი და ნიგვზის სოუსი.',en:'Ripe tomatoes, cucumber, fresh herbs and walnut dressing.',ru:'Спелые помидоры, огурцы, свежая зелень и ореховая заправка.'},price:16,image:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-mtsvadi',category:'mains',active:true,name:{ka:'ღორის მწვადი',en:'Pork Mtsvadi',ru:'Свиной мцвади'},description:{ka:'ნაკვერჩხალზე შემწვარი ღორის ხორცი, ხახვითა და ტყემლით.',en:'Charcoal-grilled pork served with onion and tkemali sauce.',ru:'Свинина на углях с луком и соусом ткемали.'},price:27,image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-odjakhuri',category:'mains',active:true,name:{ka:'ოჯახური',en:'Ojakhuri',ru:'Оджахури'},description:{ka:'შემწვარი ღორის ხორცი, კარტოფილი და ქართული სანელებლები.',en:'Pan-fried pork, potatoes and fragrant Georgian spices.',ru:'Обжаренная свинина, картофель и ароматные грузинские специи.'},price:23,image:'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-chakho',category:'mains',active:true,name:{ka:'ჩაქაფული',en:'Chakapuli',ru:'Чакапули'},description:{ka:'ხბოს ხორცი, ტარხუნა, მწვანე ტყემალი და ახალი მწვანილი.',en:'Veal stew with tarragon, green plums and fresh herbs.',ru:'Тушёная телятина с эстрагоном, зелёной алычой и зеленью.'},price:29,image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-chikhirtma',category:'soup',active:true,name:{ka:'ჩიხირთმა',en:'Chikhirtma Soup',ru:'Чихиртма'},description:{ka:'ქართული ქათმის წვნიანი კვერცხითა და ქინძით.',en:'Classic Georgian chicken soup with egg and fresh coriander.',ru:'Классический грузинский куриный суп с яйцом и свежей кинзой.'},price:14,image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-kharcho',category:'soup',active:true,name:{ka:'ხარჩო',en:'Kharcho Soup',ru:'Харчо'},description:{ka:'არომატული საქონლის ხორცის წვნიანი ბრინჯითა და მწვანილით.',en:'Aromatic beef soup with rice, herbs and Georgian spices.',ru:'Ароматный говяжий суп с рисом, зеленью и грузинскими специями.'},price:16,image:'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-khachapuri',category:'bakery',active:true,name:{ka:'იმერული ხაჭაპური',en:'Imeretian Khachapuri',ru:'Имеретинский хачапури'},description:{ka:'ოქროსფრად გამომცხვარი ცომი და ნაზი იმერული ყველი.',en:'Golden-baked bread filled with soft Imeretian cheese.',ru:'Румяная выпечка с нежным имеретинским сыром.'},price:19,image:'https://images.unsplash.com/photo-1570461226513-e08b58a52e53?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-khinkali',category:'bakery',active:true,name:{ka:'ხინკალი · 5 ცალი',en:'Khinkali · 5 pieces',ru:'Хинкали · 5 шт.'},description:{ka:'ხელით მოზელილი ცომი, ხორციანი წვნიანი შიგთავსით.',en:'Hand-folded dough filled with seasoned meat and broth.',ru:'Лепное тесто с сочной мясной начинкой и бульоном.'},price:17,image:'https://images.unsplash.com/photo-1563240229-0d3a4e4d5a6b?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-lobiani',category:'bakery',active:true,name:{ka:'ლობიანი',en:'Lobiani',ru:'Лобиани'},description:{ka:'რბილი ცომეული, სანელებლებით შეზავებული ლობიოს გულსართით.',en:'Soft Georgian bread filled with seasoned beans.',ru:'Мягкая грузинская выпечка с пряной фасолевой начинкой.'},price:12,image:'https://images.unsplash.com/photo-1608198093002-ad4e00548482?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-saperavi',category:'wine',active:true,isWine:true,glassPriceEnabled:true,name:{ka:'საფერავი · წითელი მშრალი',en:'Saperavi · Dry Red',ru:'Саперави · сухое красное'},description:{ka:'მუქი ალუბლისფერი ქართული ღვინო კენკრის ტონებით.',en:'Deep ruby Georgian wine with dark berry notes.',ru:'Насыщенное рубиновое грузинское вино с оттенками тёмных ягод.'},price:58,glassPrice:12,image:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-tsinandali',category:'wine',active:true,isWine:true,glassPriceEnabled:true,name:{ka:'წინანდალი · თეთრი მშრალი',en:'Tsinandali · Dry White',ru:'Цинандали · сухое белое'},description:{ka:'ელეგანტური თეთრი ღვინო ციტრუსისა და ყვავილების ნოტებით.',en:'Elegant white wine with citrus and floral notes.',ru:'Элегантное белое вино с цитрусовыми и цветочными нотами.'},price:46,glassPrice:10,image:'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-lemonade',category:'drinks',active:true,name:{ka:'ტარხუნის ლიმონათი',en:'Tarragon Lemonade',ru:'Лимонад с тархуном'},description:{ka:'გამაგრილებელი ქართული ლიმონათი — 0.5 ლ.',en:'Refreshing Georgian tarragon lemonade · 0.5 L.',ru:'Освежающий грузинский лимонад с тархуном · 0,5 л.'},price:6,image:'https://images.unsplash.com/photo-1513558161293-cdaf765edfd47?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-water',category:'drinks',active:true,name:{ka:'მინერალური წყალი',en:'Mineral Water',ru:'Минеральная вода'},description:{ka:'ბუნებრივი მინერალური წყალი — 0.5 ლ.',en:'Natural mineral water · 0.5 L.',ru:'Натуральная минеральная вода · 0,5 л.'},price:3,image:'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=82'},
  {id:'demo-cake',category:'desserts',active:true,name:{ka:'თაფლის ნამცხვარი',en:'Honey Cake',ru:'Медовый торт'},description:{ka:'ნაზი ფენები, თაფლის არომატი და მსუბუქი კრემი.',en:'Delicate layers, honey aroma and a light cream filling.',ru:'Нежные коржи, аромат мёда и лёгкий сливочный крем.'},price:11,image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=82'}
];

const ui = {
  ka:{brandTagline:'ქართული გემო · ღვინის კულტურა',chooseLanguage:'ენის არჩევა',cart:'კალათა',heroEyebrow:'სუფრა იწყება აქ',heroTitle:'ქართული გემო,<br><em>თბილი ამბავი.</em>',heroDescription:'შეარჩიეთ საყვარელი კერძები, აღმოაჩინეთ ჩვენი ღვინოები და შექმენით თქვენი სუფრა.',freshIngredients:'ნატურალური ინგრედიენტები',georgianHospitality:'ქართული სტუმართმოყვარეობა',ourMenu:'ჩვენი მენიუ',menuTitle:'აირჩიეთ თქვენი გემო',menuCaption:'მომზადებულია სიყვარულით<br>და საუკეთესო ინგრედიენტებით.',pricesInGel:'ფასები მითითებულია ლარში',nothingHere:'ამ სექციაში ჯერ არაფერია',tryAnotherCategory:'სცადეთ სხვა კატეგორიის არჩევა.',closingEyebrow:'სუფრა უფრო მეტია, ვიდრე კერძები',closingTitle:'ეს არის დრო, რომელსაც ერთმანეთს ვუთმობთ.',closingText:'აირჩიეთ, გააზიარეთ და ისიამოვნეთ — ჩვენ კი თქვენს სუფრას გემოს შევმატებთ.',footerLine:'შექმნილია გულით · გემოსთვის, რომელიც გახსოვთ',backToTop:'თავში დაბრუნება',rights:'ყველა უფლება დაცულია',footerSignature:'ქართული სუფრის ტრადიცია',yourSelection:'თქვენი არჩევანი',cartTitle:'შეკვეთის კალათა',cartEmpty:'კალათა ჯერ ცარიელია.\nშეარჩიეთ თქვენთვის სასურველი კერძები.',subtotal:'შუალედური ჯამი',total:'სულ გადასახდელი',showOrderSummary:'შეკვეთის შეჯამება',cartHint:'ეს დემო კალათაა — შეკვეთა ჯერ არ იგზავნება.',items:'კერძი',price:'ფასი',addToCart:'კალათაში დამატება',addBottle:'ბოთლის დამატება',addGlass:'ჭიქის დამატება',bottle:'ბოთლი',glass:'ჭიქა',added:'დაემატა კალათაში',summaryTitle:'შეკვეთის შეჯამება',summaryItems:'შეკვეთაშია',summaryTotal:'სრული ღირებულება',summaryEmpty:'შეკვეთა ცარიელია.',remove:'წაშლა',decrease:'შემცირება',increase:'გაზრდა',translationUnavailable:'თარგმანი მიუწვდომელია'},
  en:{brandTagline:'Georgian taste · Wine culture',chooseLanguage:'Choose language',cart:'Cart',heroEyebrow:'Your table starts here',heroTitle:'Georgian taste,<br><em>a warmer story.</em>',heroDescription:'Choose your favourites, discover our wines, and make the table your own.',freshIngredients:'Natural ingredients',georgianHospitality:'Georgian hospitality',ourMenu:'Our menu',menuTitle:'Find your flavour',menuCaption:'Made with care<br>and the finest ingredients.',pricesInGel:'Prices are shown in GEL',nothingHere:'Nothing in this section yet',tryAnotherCategory:'Try choosing another category.',closingEyebrow:'A table is more than food',closingTitle:'It is time we choose to share with one another.',closingText:'Choose, share and enjoy — we will add a little flavour to your table.',footerLine:'Made with heart · for flavours worth remembering',backToTop:'Back to top',rights:'All rights reserved',footerSignature:'The tradition of Georgian hospitality',yourSelection:'Your selection',cartTitle:'Your order',cartEmpty:'Your cart is empty.\nChoose something you would love to try.',subtotal:'Subtotal',total:'Total to pay',showOrderSummary:'Review order summary',cartHint:'This is a demo cart — no order is sent.',items:'items',price:'Price',addToCart:'Add to cart',addBottle:'Add bottle',addGlass:'Add glass',bottle:'Bottle',glass:'Glass',added:'Added to cart',summaryTitle:'Order summary',summaryItems:'Items in your order',summaryTotal:'Order total',summaryEmpty:'Your order is empty.',remove:'Remove',decrease:'Decrease',increase:'Increase',translationUnavailable:'Translation unavailable'},
  ru:{brandTagline:'Грузинский вкус · Культура вина',chooseLanguage:'Выберите язык',cart:'Корзина',heroEyebrow:'Ваш стол начинается здесь',heroTitle:'Грузинский вкус,<br><em>тёплая история.</em>',heroDescription:'Выберите любимые блюда, откройте для себя наши вина и составьте своё застолье.',freshIngredients:'Натуральные ингредиенты',georgianHospitality:'Грузинское гостеприимство',ourMenu:'Наше меню',menuTitle:'Выберите свой вкус',menuCaption:'Приготовлено с любовью<br>из лучших ингредиентов.',pricesInGel:'Цены указаны в лари',nothingHere:'В этом разделе пока ничего нет',tryAnotherCategory:'Попробуйте выбрать другую категорию.',closingEyebrow:'Застолье — это больше, чем еда',closingTitle:'Это время, которым мы делимся друг с другом.',closingText:'Выбирайте, делитесь и наслаждайтесь — мы добавим вкуса вашему столу.',footerLine:'Сделано с душой · ради вкуса, который запоминается',backToTop:'Наверх',rights:'Все права защищены',footerSignature:'Традиции грузинского застолья',yourSelection:'Ваш выбор',cartTitle:'Корзина заказа',cartEmpty:'Корзина пока пуста.\nВыберите то, что хотите попробовать.',subtotal:'Промежуточный итог',total:'Итого к оплате',showOrderSummary:'Посмотреть заказ',cartHint:'Это демо-корзина — заказ не отправляется.',items:'позиций',price:'Цена',addToCart:'В корзину',addBottle:'Добавить бутылку',addGlass:'Добавить бокал',bottle:'Бутылка',glass:'Бокал',added:'Добавлено в корзину',summaryTitle:'Состав заказа',summaryItems:'В заказе',summaryTotal:'Общая стоимость',summaryEmpty:'Ваш заказ пуст.',remove:'Удалить',decrease:'Уменьшить',increase:'Увеличить',translationUnavailable:'Перевод недоступен'}
};

let lang = localStorage.getItem('demo3_language') || 'ka';
let activeCategory = 'all';
let cart = {};
let menuItems = [...seedItems];
let db = null;
let toastTimeout;
const $ = (id) => document.getElementById(id);
const escapeHtml = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr = (key) => (ui[lang] && ui[lang][key]) || ui.ka[key] || key;
const localized = (obj) => (obj && typeof obj === 'object' && obj[lang]) ? obj[lang] : tr('translationUnavailable');
const categoryLabel = (key) => categoryInfo[key]?.[lang] || key;
const money = (value) => `₾${Number(value || 0).toFixed(2)}`;

function applyLanguage(){
  document.documentElement.lang = lang;
  document.title = lang==='ka' ? 'მარანი — ციფრული მენიუ' : lang==='en' ? 'Marani — Digital Menu' : 'Марани — цифровое меню';
  $('languageSelect').value = lang;
  $('languageSelect').setAttribute('aria-label', tr('chooseLanguage'));
  $('categoryFilters').setAttribute('aria-label', tr('ourMenu'));
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (ui[lang]?.[key] !== undefined) el.innerHTML = ui[lang][key];
  });
  $('openCartButton').setAttribute('aria-label', tr('cart'));
  $('closeCartButton').setAttribute('aria-label', lang==='ka'?'კალათის დახურვა':lang==='ru'?'Закрыть корзину':'Close cart');
  renderCategories();
  renderProducts();
  renderCart();
}
function renderCategories(){
  const keys = Object.keys(categoryInfo);
  $('categoryFilters').innerHTML = keys.map(key => `<button type="button" class="category-button ${activeCategory===key?'active':''}" data-category="${key}" aria-pressed="${activeCategory===key}">${escapeHtml(categoryLabel(key))}</button>`).join('');
}
function renderProducts(){
  const visible = menuItems.filter(item => item.active !== false && (activeCategory==='all' || item.category===activeCategory));
  $('resultCount').textContent = `${visible.length} ${tr('items')}`;
  $('emptyState').hidden = visible.length > 0;
  $('productGrid').innerHTML = visible.map(item => {
    const name = localized(item.name), description = localized(item.description);
    const isWine = item.isWine === true || item.category === 'wine';
    let bottom = '';
    if (isWine) {
      bottom = `<div class="price-options"><div class="wine-price-line"><span>${escapeHtml(tr('bottle'))}</span><strong>${money(item.price)}</strong></div><button class="add-button small" type="button" data-add="${escapeHtml(item.id)}" data-variant="bottle">＋ ${escapeHtml(tr('addBottle'))}</button>${item.glassPriceEnabled && Number(item.glassPrice)>0 ? `<div class="wine-price-line"><span>${escapeHtml(tr('glass'))}</span><strong>${money(item.glassPrice)}</strong></div><button class="add-button small" type="button" data-add="${escapeHtml(item.id)}" data-variant="glass">＋ ${escapeHtml(tr('addGlass'))}</button>` : ''}</div>`;
    } else {
      bottom = `<div class="product-bottom"><div class="price-block"><span class="price-label">${escapeHtml(tr('price'))}</span><strong class="product-price">${money(item.price)}</strong></div><button class="add-button" type="button" data-add="${escapeHtml(item.id)}" data-variant="item">＋ ${escapeHtml(tr('addToCart'))}</button></div>`;
    }
    const image = item.image || '';
    return `<article class="product-card"><div class="product-photo-wrap"><img class="product-photo" loading="lazy" src="${escapeHtml(image)}" alt="${escapeHtml(name)}"><span class="product-category-tag">${escapeHtml(categoryLabel(item.category))}</span></div><div class="product-content"><div class="product-title-row"><h3 class="product-title">${escapeHtml(name)}</h3></div><p class="product-description">${escapeHtml(description)}</p>${bottom}</div></article>`;
  }).join('');
  $('productGrid').querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.onerror = null; img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#463729"/><text x="50%" y="50%" font-size="34" text-anchor="middle" dominant-baseline="middle" fill="#d2a65e">MARANI ✦</text></svg>`); });
  });
}
function variantLabel(variant){ return variant==='glass' ? tr('glass') : variant==='bottle' ? tr('bottle') : ''; }
function itemPrice(item, variant){ return variant==='glass' ? Number(item.glassPrice || 0) : Number(item.price || 0); }
function addToCart(id, variant='item'){
  const item = menuItems.find(p => String(p.id)===String(id));
  if(!item || item.active===false) return;
  const key = `${item.id}__${variant}`;
  if(!cart[key]) cart[key] = {id:item.id,variant,quantity:0};
  cart[key].quantity++;
  renderCart();
  showToast(`${localized(item.name)} — ${tr('added')}`);
}
function getCartRows(){
  return Object.values(cart).map(entry => {
    const item = menuItems.find(p => String(p.id)===String(entry.id));
    return item ? {...entry,item,unitPrice:itemPrice(item,entry.variant)} : null;
  }).filter(Boolean);
}
function changeQuantity(key, delta){
  if(!cart[key]) return;
  cart[key].quantity += delta;
  if(cart[key].quantity<=0) delete cart[key];
  renderCart();
}
function renderCart(){
  const rows = getCartRows();
  const count = rows.reduce((sum,row)=>sum+row.quantity,0);
  const total = rows.reduce((sum,row)=>sum + row.quantity*row.unitPrice,0);
  $('cartCount').textContent = count;
  $('cartSubtotal').textContent = money(total);
  $('cartTotal').textContent = money(total);
  $('cartEmpty').hidden = rows.length > 0;
  $('cartItems').innerHTML = rows.map(row => {
    const name = localized(row.item.name) + (row.variant!=='item' ? ` · ${variantLabel(row.variant)}` : '');
    const key = `${row.id}__${row.variant}`;
    return `<div class="cart-line"><div><div class="cart-line-title">${escapeHtml(name)}</div><div class="cart-line-sub">${money(row.unitPrice)} × ${row.quantity}</div><button class="remove-line" type="button" data-remove="${escapeHtml(key)}">${escapeHtml(tr('remove'))}</button></div><div class="cart-line-right"><strong class="cart-line-price">${money(row.unitPrice*row.quantity)}</strong><div class="quantity-control"><button type="button" data-qty="${escapeHtml(key)}" data-delta="-1" aria-label="${escapeHtml(tr('decrease'))}">−</button><span>${row.quantity}</span><button type="button" data-qty="${escapeHtml(key)}" data-delta="1" aria-label="${escapeHtml(tr('increase'))}">＋</button></div></div></div>`;
  }).join('');
}
function openCart(){ $('cartOverlay').hidden=false; $('cartDrawer').classList.add('open'); $('cartDrawer').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeCart(){ $('cartDrawer').classList.remove('open'); $('cartDrawer').setAttribute('aria-hidden','true'); $('cartOverlay').hidden=true; document.body.style.overflow=''; }
function showToast(message){ const toast=$('toast'); toast.textContent=message; toast.classList.add('show'); clearTimeout(toastTimeout); toastTimeout=setTimeout(()=>toast.classList.remove('show'),2500); }
function showOrderSummary(){
  const rows = getCartRows();
  if(!rows.length){ showToast(tr('summaryEmpty')); return; }
  const total = rows.reduce((sum,row)=>sum + row.quantity*row.unitPrice,0);
  const itemLines = rows.map(row=>`${localized(row.item.name)}${row.variant!=='item'?` (${variantLabel(row.variant)})`:''} × ${row.quantity} = ${money(row.quantity*row.unitPrice)}`).join('\n');
  showToast(`${tr('summaryTitle')}: ${rows.reduce((sum,row)=>sum+row.quantity,0)} ${tr('items')} · ${money(total)}`);
  // A native dialog keeps the summary readable and fully localized without pretending to submit an order.
  window.alert(`${tr('summaryTitle')}\n\n${itemLines}\n\n${tr('summaryTotal')}: ${money(total)}`);
}

$('languageSelect').addEventListener('change', event=>{lang=event.target.value;localStorage.setItem('demo3_language',lang);applyLanguage();});
$('categoryFilters').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderCategories();renderProducts();});
$('productGrid').addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(button)addToCart(button.dataset.add,button.dataset.variant||'item');});
$('openCartButton').addEventListener('click',()=>{renderCart();openCart();});
$('closeCartButton').addEventListener('click',closeCart);
$('cartOverlay').addEventListener('click',closeCart);
$('cartItems').addEventListener('click',event=>{const remove=event.target.closest('[data-remove]');if(remove){delete cart[remove.dataset.remove];renderCart();return;}const qty=event.target.closest('[data-qty]');if(qty)changeQuantity(qty.dataset.qty,Number(qty.dataset.delta));});
$('summaryButton').addEventListener('click',showOrderSummary);
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCart();});
$('currentYear').textContent = new Date().getFullYear();

if(firebaseConfigured){
  try{
    const app=initializeApp(firebaseConfig); db=getFirestore(app);
    onSnapshot(collection(db,'menuItems'), snapshot=>{
      const remote=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));
      menuItems=remote.length?remote:seedItems;
      renderCategories();renderProducts();renderCart();
    }, error=>{console.error('Firestore read failed:',error);menuItems=seedItems;renderCategories();renderProducts();showToast('Firebase connection problem — showing demo menu');});
  }catch(error){console.error(error);menuItems=seedItems;}
}else{
  try{const saved=JSON.parse(localStorage.getItem(LOCAL_KEY)||'null');if(Array.isArray(saved))menuItems=saved;}catch(error){console.warn('Local demo data could not be read',error);}
  window.addEventListener('storage',event=>{if(event.key===LOCAL_KEY){try{const saved=JSON.parse(event.newValue||'null');if(Array.isArray(saved))menuItems=saved;else menuItems=seedItems;renderCategories();renderProducts();renderCart();}catch{}}});
}
applyLanguage();
