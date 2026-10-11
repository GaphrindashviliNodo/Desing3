import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

// Keep this config in sync with demo3.js. Replace placeholders using Firebase Console > Project settings.
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
  salads:{ka:'სალათები',en:'Salads',ru:'Салаты'},mains:{ka:'ცხელი კერძები',en:'Main dishes',ru:'Горячие блюда'},soup:{ka:'წვნიანი',en:'Soups',ru:'Супы'},bakery:{ka:'ცომეული',en:'Bakery',ru:'Выпечка'},wine:{ka:'ღვინო',en:'Wine',ru:'Вино'},drinks:{ka:'სასმელები',en:'Drinks',ru:'Напитки'},desserts:{ka:'დესერტი',en:'Desserts',ru:'Десерты'}
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

const t9n = {
 ka:{brand:'მარანი',namePlaceholder:'მაგ. იმერული ხაჭაპური',descriptionPlaceholder:'კერძის მოკლე აღწერა...',adminSubtitle:'მენიუს მართვის პანელი',demoMode:'დემო რეჟიმი',language:'ენა',logout:'გასვლა',openMenu:'მენიუს ნახვა ↗',workspace:'სამუშაო სივრცე',pageTitle:'მენიუს მართვა',pageDescription:'დაამატეთ კერძები, შეცვალეთ ფასი და აკონტროლეთ ხელმისაწვდომობა.',secureAccess:'დაცული წვდომა',loginTitle:'მენეჯერის შესვლა',loginDescription:'შეიყვანეთ Firebase Authentication-ში წინასწარ შექმნილი მენეჯერის ანგარიში.',email:'ელფოსტა',password:'პაროლი',signIn:'შესვლა',productSetup:'პროდუქტის მონაცემები',addProduct:'ახალი კერძის დამატება',translationNote:'შეავსეთ სახელი და აღწერა არჩეულ ენაზე, შემდეგ დააჭირეთ თარგმნას. შედეგის ველების შესწორებაც შეგიძლიათ.',sourceLanguage:'შეყვანის ენა',category:'სექცია',productName:'კერძის დასახელება',description:'აღწერა',translations:'თარგმანები',translationsHint:'თარგმანი ავტომატურად წარმოიქმნება და მისი რედაქტირებაც შეგიძლიათ.',translateNow:'თარგმნა',priceGel:'ფასი (₾)',photo:'ფოტო',photoHint:'ფოტო ავტომატურად შეიკუმშება; Firebase რეჟიმში ერთი ფოტო 700KB-მდე უნდა იყოს.',sellByGlass:'ღვინის ჭიქით გაყიდვის ჩართვა',glassPrice:'ჭიქის ფასი (₾)',wineHint:'ღვინის ძირითადი ფასი ჩაითვლება ბოთლის ფასად.',selectedImage:'არჩეული ფოტო',removeImage:'ფოტოს მოხსნა',saveProduct:'კერძის შენახვა',cancelEdit:'რედაქტირების გაუქმება',catalog:'კატალოგი',productsList:'კერძების სია',searchPlaceholder:'კერძის ძიება...',allStatuses:'ყველა სტატუსი',available:'აქტიური',stopped:'სტოპში',importHint:'Firestore ჯერ ცარიელია. შეგიძლია ჩატვირთო 15 სატესტო კერძი.',importDemos:'15 დემო კერძის ჩატვირთვა',noProducts:'შესაბამისი კერძი ვერ მოიძებნა.',listFootnote:'სტოპში გაშვებული კერძი სტუმრის მენიუში აღარ გამოჩნდება.',adminFooter:'მარანი · მენიუს მართვის სივრცე',viewCustomerMenu:'მომხმარებლის მენიუ →',nameKa:'სახელი · ქართული',nameEn:'სახელი · ინგლისური',nameRu:'სახელი · რუსული',descKa:'აღწერა · ქართული',descEn:'აღწერა · ინგლისური',descRu:'აღწერა · რუსული',categoryLabel:'სექცია',edit:'შეცვლა',stop:'სტოპში',activate:'ჩართვა',delete:'წაშლა',priceLabel:'ფასი',bottle:'ბოთლი',glass:'ჭიქა',categoryPlaceholder:'აირჩიეთ სექცია',translating:'ითარგმნება...',translationSuccess:'თარგმანები მომზადებულია — გადაამოწმეთ ტექსტი შენახვამდე.',translationFail:'ავტომატური თარგმანი ვერ შესრულდა. შეამოწმეთ ინტერნეტი ან შეავსეთ თარგმანები ხელით.',saveSuccess:'კერძი შენახულია.',saveFail:'შენახვა ვერ მოხერხდა.',fillTranslations:'შეავსეთ ან ავტომატურად თარგმნეთ ყველა ენის ველი.',needsTranslation:'სახელი ან აღწერა შეიცვალა — ხელახლა დააჭირეთ თარგმნას.',editMode:'კერძის რედაქტირება',saving:'ინახება...',deleteConfirm:'ნამდვილად წავშალოთ ეს კერძი?',stopConfirm:'კერძი სტუმრის მენიუდან გაქრება. გავაგრძელოთ?',stopSuccess:'კერძი სტოპშია.',activeSuccess:'კერძი მენიუში დაბრუნდა.',deleteSuccess:'კერძი წაიშალა.',photoTooLarge:'ფოტო ზედმეტად დიდია ან ვერ მუშავდება; სცადეთ სხვა სურათი.',uploadingPhoto:'ფოტო იტვირთება...',photoUploadFail:'ფოტოს ატვირთვა ვერ მოხერხდა. გადაამოწმეთ Firebase Storage და ბილინგი.',loginFail:'შესვლა ვერ მოხერხდა. გადაამოწმეთ ელფოსტა და პაროლი.',loginRequired:'ცვლილებისთვის მენეჯერის ანგარიშია საჭირო.',firebaseEmpty:'Firestore-ში ჯერ პროდუქტები არაა შენახული.',importSuccess:'15 დემო კერძი ჩაიტვირთა.',importFail:'დემო კერძების ჩატვირთვა ვერ მოხერხდა.',demoDataHint:'დემო რეჟიმში ცვლილებები ინახება ამ ბრაუზერში და სხვა მოწყობილობას არ სინქრონდება.',serverDataHint:'Firebase ჩართულია. ცვლილებები Firestore-ში ინახება.',activeLabel:'აქტიური',stoppedLabel:'სტოპში',wineGlassEnabled:'ჭიქით იყიდება',missingImage:'ფოტო არ არის',noImageFile:'ფაილი არ აგირჩევიათ',modeFirebase:'Firebase რეჟიმი',status:'სტატუსი',notSignedIn:'Firebase რეჟიმში შესასვლელად მენეჯერის ანგარიში გამოიყენეთ.'},
 en:{brand:'Marani',namePlaceholder:'e.g. Imeretian khachapuri',descriptionPlaceholder:'Short description of the dish...',adminSubtitle:'Menu management panel',demoMode:'Demo mode',language:'Language',logout:'Sign out',openMenu:'View menu ↗',workspace:'Workspace',pageTitle:'Menu management',pageDescription:'Add dishes, update prices and control availability.',secureAccess:'Secure access',loginTitle:'Manager sign in',loginDescription:'Use the manager account created in Firebase Authentication.',email:'Email',password:'Password',signIn:'Sign in',productSetup:'Product details',addProduct:'Add a new item',translationNote:'Enter the name and description in the selected language, then translate. You can edit the generated translations.',sourceLanguage:'Input language',category:'Section',productName:'Item name',description:'Description',translations:'Translations',translationsHint:'Translations are generated automatically and can be edited.',translateNow:'Translate',priceGel:'Price (₾)',photo:'Photo',photoHint:'Images are compressed automatically; Firestore mode keeps each image under 700 KB.',sellByGlass:'Enable wine by the glass',glassPrice:'Glass price (₾)',wineHint:'The main wine price is treated as the bottle price.',selectedImage:'Selected image',removeImage:'Remove image',saveProduct:'Save item',cancelEdit:'Cancel editing',catalog:'Catalog',productsList:'Menu items',searchPlaceholder:'Search items...',allStatuses:'All statuses',available:'Available',stopped:'Stopped',importHint:'Firestore is empty. You can import 15 sample items.',importDemos:'Import 15 demo items',noProducts:'No matching items found.',listFootnote:'Stopped items are hidden from the customer menu.',adminFooter:'Marani · menu workspace',viewCustomerMenu:'Customer menu →',nameKa:'Name · Georgian',nameEn:'Name · English',nameRu:'Name · Russian',descKa:'Description · Georgian',descEn:'Description · English',descRu:'Description · Russian',categoryLabel:'Section',edit:'Edit',stop:'Stop',activate:'Activate',delete:'Delete',priceLabel:'Price',bottle:'Bottle',glass:'Glass',categoryPlaceholder:'Choose a section',translating:'Translating...',translationSuccess:'Translations are ready — review them before saving.',translationFail:'Automatic translation failed. Check your connection or fill translations manually.',saveSuccess:'Item saved.',saveFail:'Could not save item.',fillTranslations:'Fill or translate all fields in all three languages.',needsTranslation:'The name or description changed — click Translate again.',editMode:'Edit item',saving:'Saving...',deleteConfirm:'Delete this item?',stopConfirm:'This item will disappear from the customer menu. Continue?',stopSuccess:'Item stopped.',activeSuccess:'Item is back on the menu.',deleteSuccess:'Item deleted.',photoTooLarge:'The image is too large or cannot be processed. Try a smaller image.',uploadingPhoto:'Uploading image...',photoUploadFail:'Image upload failed. Check Firebase Storage and billing.',loginFail:'Sign-in failed. Check your email and password.',loginRequired:'A manager account is required to save changes.',firebaseEmpty:'No products have been saved in Firestore yet.',importSuccess:'15 demo items imported.',importFail:'Could not import demo items.',demoDataHint:'Demo changes are saved in this browser only and do not sync to other devices.',serverDataHint:'Firebase is connected. Changes are saved to Firestore.',activeLabel:'Available',stoppedLabel:'Stopped',wineGlassEnabled:'Sold by the glass',missingImage:'No image',noImageFile:'No image selected',modeFirebase:'Firebase mode',status:'Status',notSignedIn:'Sign in with a manager account to use Firebase mode.'},
 ru:{brand:'Марани',namePlaceholder:'Например, имеретинский хачапури',descriptionPlaceholder:'Краткое описание блюда...',adminSubtitle:'Панель управления меню',demoMode:'Демо-режим',language:'Язык',logout:'Выйти',openMenu:'Открыть меню ↗',workspace:'Рабочая область',pageTitle:'Управление меню',pageDescription:'Добавляйте блюда, меняйте цены и управляйте доступностью.',secureAccess:'Защищённый доступ',loginTitle:'Вход для менеджера',loginDescription:'Используйте аккаунт менеджера, созданный в Firebase Authentication.',email:'Электронная почта',password:'Пароль',signIn:'Войти',productSetup:'Данные блюда',addProduct:'Добавить блюдо',translationNote:'Введите название и описание на выбранном языке, затем переведите. Сгенерированный перевод можно исправить.',sourceLanguage:'Язык ввода',category:'Раздел',productName:'Название блюда',description:'Описание',translations:'Переводы',translationsHint:'Переводы создаются автоматически, их можно редактировать.',translateNow:'Перевести',priceGel:'Цена (₾)',photo:'Фото',photoHint:'Изображение сжимается автоматически; в режиме Firestore размер фото — до 700 КБ.',sellByGlass:'Разрешить продажу вина бокалами',glassPrice:'Цена бокала (₾)',wineHint:'Основная цена вина считается ценой за бутылку.',selectedImage:'Выбранное фото',removeImage:'Убрать фото',saveProduct:'Сохранить блюдо',cancelEdit:'Отменить редактирование',catalog:'Каталог',productsList:'Список блюд',searchPlaceholder:'Поиск блюд...',allStatuses:'Все статусы',available:'Активно',stopped:'Стоп',importHint:'Firestore пока пуст. Можно загрузить 15 тестовых блюд.',importDemos:'Загрузить 15 демо-блюд',noProducts:'Подходящие блюда не найдены.',listFootnote:'Блюда в стоп-листе не отображаются в меню посетителей.',adminFooter:'Марани · управление меню',viewCustomerMenu:'Меню посетителей →',nameKa:'Название · грузинский',nameEn:'Название · английский',nameRu:'Название · русский',descKa:'Описание · грузинский',descEn:'Описание · английский',descRu:'Описание · русский',categoryLabel:'Раздел',edit:'Изменить',stop:'В стоп',activate:'Включить',delete:'Удалить',priceLabel:'Цена',bottle:'Бутылка',glass:'Бокал',categoryPlaceholder:'Выберите раздел',translating:'Перевод...',translationSuccess:'Переводы готовы — проверьте текст перед сохранением.',translationFail:'Автоперевод не удался. Проверьте интернет или заполните переводы вручную.',saveSuccess:'Блюдо сохранено.',saveFail:'Не удалось сохранить блюдо.',fillTranslations:'Заполните или переведите все поля на трёх языках.',needsTranslation:'Название или описание изменилось — нажмите «Перевести» ещё раз.',editMode:'Редактирование блюда',saving:'Сохранение...',deleteConfirm:'Удалить это блюдо?',stopConfirm:'Блюдо исчезнет из меню посетителей. Продолжить?',stopSuccess:'Блюдо остановлено.',activeSuccess:'Блюдо снова в меню.',deleteSuccess:'Блюдо удалено.',photoTooLarge:'Фото слишком большое или не обрабатывается. Выберите изображение поменьше.',uploadingPhoto:'Загрузка фото...',photoUploadFail:'Не удалось загрузить фото. Проверьте Firebase Storage и биллинг.',loginFail:'Не удалось войти. Проверьте почту и пароль.',loginRequired:'Для сохранения изменений нужен аккаунт менеджера.',firebaseEmpty:'В Firestore ещё нет сохранённых товаров.',importHint:'Firestore пока пуст. Можно загрузить 15 тестовых блюд.',importDemos:'Загрузить 15 демо-блюд',importSuccess:'15 демо-блюд загружено.',importFail:'Не удалось загрузить демо-блюда.',demoDataHint:'Демо-изменения сохраняются только в этом браузере и не синхронизируются.',serverDataHint:'Firebase подключён. Изменения сохраняются в Firestore.',activeLabel:'Активно',stoppedLabel:'В стопе',wineGlassEnabled:'Продаётся бокалами',missingImage:'Нет фото',noImageFile:'Файл не выбран',modeFirebase:'Режим Firebase',status:'Статус',notSignedIn:'Войдите в аккаунт менеджера для работы с Firebase.'}
};

let lang=localStorage.getItem('demo3_admin_language')||'ka';
let localItems=null;
let remoteItems=[];
let items=[];
let editingId=null;
let selectedFile=null;
let selectedFilePreview='';
let firebaseApp=null,auth=null,db=null,currentUser=null;
let translationSignature='';
let snapshotUnsubscribe=null;
let toastTimeout=null;
const $=id=>document.getElementById(id);
const escapeHtml=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=key=>t9n[lang]?.[key]||t9n.ka[key]||key;
const catLabel=key=>categoryInfo[key]?.[lang]||key;
const money=value=>`₾${Number(value||0).toFixed(2)}`;

function applyLanguage(){
  document.documentElement.lang=lang;
  $('adminLanguage').value=lang;
  $('adminLanguage').setAttribute('aria-label',t('language'));
  $('statusFilter').setAttribute('aria-label',t('status'));
  if($('formTitle'))$('formTitle').textContent=editingId?t('editMode'):t('addProduct');
  if($('modeHint'))$('modeHint').textContent=t(firebaseConfigured?'serverDataHint':'demoDataHint');
  if(editingId&&!selectedFile&&!$('imagePreviewRow').hidden)$('imageFileName').textContent=t('selectedImage');
  document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(t9n[lang]?.[key]!==undefined)el.textContent=t(key);});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const key=el.dataset.i18nPlaceholder;if(t9n[lang]?.[key]!==undefined)el.placeholder=t(key);});
  document.title=`${t('brand')} — ${t('adminSubtitle')}`;
  $('modePill').querySelector('span').textContent=firebaseConfigured?t('modeFirebase'):t('demoMode');
  if($('modePill').firstElementChild){$('modePill').classList.toggle('connected',firebaseConfigured&&Boolean(currentUser));}
  const currentCat=$('categorySelect').value;
  $('categorySelect').innerHTML=Object.keys(categoryInfo).map(key=>`<option value="${key}">${escapeHtml(catLabel(key))}</option>`).join('');
  $('categorySelect').value=categoryInfo[currentCat]?currentCat:'mains';
  buildTranslationFields();
  renderItems();
  updateWineFields();
  if($('translationStatus').textContent && !translationSignature) setNote('translationStatus',t('needsTranslation'));
}
function buildTranslationFields(){
  const langs=[['ka','ქართული'],['en','English'],['ru','Русский']];
  const old={};
  for(const [code] of langs){old[`name-${code}`]=$(`name-${code}`)?.value||'';old[`desc-${code}`]=$(`desc-${code}`)?.value||'';}
  $('translationFields').innerHTML=langs.map(([code,label])=>`<div class="translation-language"><div class="translation-language-head"><span class="language-code">${code.toUpperCase()}</span><span>${label}</span></div><div class="translation-language-grid"><label>${escapeHtml(t(code==='ka'?'nameKa':code==='en'?'nameEn':'nameRu'))}<input id="name-${code}" class="field translated-name" type="text" maxlength="100" value="${escapeHtml(old[`name-${code}`])}"></label><label>${escapeHtml(t(code==='ka'?'descKa':code==='en'?'descEn':'descRu'))}<textarea id="desc-${code}" class="field translated-description" maxlength="350">${escapeHtml(old[`desc-${code}`])}</textarea></label></div></div>`).join('');
}
function sourceSignature(){return JSON.stringify({lang:$('sourceLanguage').value,name:$('nameInput').value.trim(),description:$('descriptionInput').value.trim()});}
function getNameMap(){return Object.fromEntries(['ka','en','ru'].map(code=>[code,$(`name-${code}`).value.trim()]));}
function getDescriptionMap(){return Object.fromEntries(['ka','en','ru'].map(code=>[code,$(`desc-${code}`).value.trim()]));}
function setNote(id,message,type=''){const element=$(id);element.textContent=message||'';element.className=`form-note ${type}`.trim();element.hidden=!message;}
function showToast(message){const toast=$('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove('show'),2800);}
function setTranslationInputs(name={},description={}){for(const code of ['ka','en','ru']){if($(`name-${code}`))$(`name-${code}`).value=name[code]||'';if($(`desc-${code}`))$(`desc-${code}`).value=description[code]||'';}}
function buildList(){
  if(firebaseConfigured) items=remoteItems.length?[...remoteItems]:[...seedItems];
  else items=Array.isArray(localItems)?[...localItems]:[...seedItems];
  renderItems();
  $('demoImportRow').hidden=!(firebaseConfigured&&remoteItems.length===0&&Boolean(currentUser));
}
function renderItems(){
  const query=$('searchInput').value.trim().toLocaleLowerCase();
  const filter=$('statusFilter').value;
  const filtered=items.filter(item=>{
    const searchable=['ka','en','ru'].map(code=>item.name?.[code]||'').join(' ').toLocaleLowerCase();
    if(query&&!searchable.includes(query))return false;
    if(filter==='active'&&item.active===false)return false;
    if(filter==='stopped'&&item.active!==false)return false;
    return true;
  });
  $('itemCount').textContent=String(items.length);
  $('listEmpty').hidden=filtered.length>0;
  $('productList').innerHTML=filtered.map(item=>{
    const stopped=item.active===false;
    const name=item.name?.[lang]||item.name?.ka||t('missingImage');
    const image=item.image||'';
    const wine=item.isWine===true||item.category==='wine';
    const price=wine?`${money(item.price)}${item.glassPriceEnabled&&Number(item.glassPrice)>0?` · ${money(item.glassPrice)} / ${t('glass')}`:''}`:money(item.price);
    return `<article class="admin-product ${stopped?'stopped':''}" data-id="${escapeHtml(item.id)}"><img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy"><div class="admin-product-main"><strong>${escapeHtml(name)}</strong><div class="product-meta"><span class="product-category">${escapeHtml(catLabel(item.category))}</span><span>·</span><span class="status-pill ${stopped?'stopped':''}">${escapeHtml(stopped?t('stoppedLabel'):t('activeLabel'))}</span>${wine&&item.glassPriceEnabled?`<span>· ${escapeHtml(t('wineGlassEnabled'))}</span>`:''}</div></div><div class="admin-product-actions-wrap"><strong class="admin-product-price">${price}</strong><div class="product-actions"><button type="button" class="mini-button" data-action="edit" data-id="${escapeHtml(item.id)}">${escapeHtml(t('edit'))}</button><button type="button" class="mini-button stop-action" data-action="toggle" data-id="${escapeHtml(item.id)}">${escapeHtml(stopped?t('activate'):t('stop'))}</button><button type="button" class="mini-button delete-action" data-action="delete" data-id="${escapeHtml(item.id)}">${escapeHtml(t('delete'))}</button></div></div></article>`;
  }).join('');
  $('productList').querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.onerror=null;img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#463729"/><text x="50%" y="50%" font-size="23" text-anchor="middle" dominant-baseline="middle" fill="#d2a65e">MARANI ✦</text></svg>');}));
}
function updateWineFields(){
  const isWine=$('categorySelect').value==='wine';
  $('wineSettings').hidden=!isWine;
  $('glassPriceWrap').hidden=!isWine||!$('glassEnabled').checked;
  $('glassPriceInput').required=isWine&&$('glassEnabled').checked;
}
function markSourceChanged(){
  translationSignature='';
  setNote('translationStatus',t('needsTranslation'));
}
function splitText(text,maxBytes=420){const out=[];let chunk='';for(const word of String(text||'').trim().split(/\s+/)){const candidate=chunk?`${chunk} ${word}`:word;if(new TextEncoder().encode(candidate).length>maxBytes&&chunk){out.push(chunk);chunk=word;}else chunk=candidate;}if(chunk)out.push(chunk);return out;}
async function translatePart(text,from,to){
  if(from===to)return text;
  const params=new URLSearchParams({q:text,langpair:`${from}|${to}`,mt:'1'});
  const response=await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`);
  if(!response.ok)throw new Error(`Translation service returned ${response.status}`);
  const data=await response.json();
  const translated=data?.responseData?.translatedText;
  if(data?.responseStatus!==200||!translated||translated.toLowerCase().includes('query length limit'))throw new Error('Translation unavailable');
  return translated;
}
async function translateText(text,from,to){
  const parts=splitText(text);
  const translated=[];
  for(const part of parts)translated.push(await translatePart(part,from,to));
  return translated.join(' ');
}
async function translateAll(){
  const name=$('nameInput').value.trim(),description=$('descriptionInput').value.trim(),from=$('sourceLanguage').value;
  if(!name||!description){setNote('translationStatus',t('fillTranslations'),'error-note');return false;}
  $('translateButton').disabled=true;setNote('translationStatus',t('translating'));
  const nm={},ds={};nm[from]=name;ds[from]=description;
  try{
    for(const to of ['ka','en','ru']){
      if(to===from)continue;
      nm[to]=await translateText(name,from,to);
      ds[to]=await translateText(description,from,to);
    }
    setTranslationInputs(nm,ds);
    translationSignature=sourceSignature();
    setNote('translationStatus',t('translationSuccess'),'success');
    return true;
  }catch(error){
    console.warn('Automatic translation failed:',error);
    setTranslationInputs(nm,ds);
    setNote('translationStatus',t('translationFail'),'error-note');
    // Allow manual completion after a translation API error. Saving still validates all six fields.
    translationSignature=sourceSignature();
    return false;
  }finally{$('translateButton').disabled=false;}
}
function resetForm(){
  editingId=null;selectedFile=null;selectedFilePreview='';$('productForm').reset();$('sourceLanguage').value='ka';$('categorySelect').value='mains';$('glassEnabled').checked=false;$('glassPriceInput').value='';$('photoInput').value='';$('imagePreviewRow').hidden=true;$('imagePreview').src='';$('formTitle').textContent=t('addProduct');$('saveButton').querySelector('span:last-child').textContent=t('saveProduct');$('cancelEditButton').hidden=true;setTranslationInputs();translationSignature='';setNote('translationStatus','');setNote('formStatus','');updateWineFields();}
function editItem(id){
  const item=items.find(p=>String(p.id)===String(id));if(!item)return;
  editingId=String(item.id);selectedFile=null;selectedFilePreview='';$('photoInput').value='';$('sourceLanguage').value='ka';$('categorySelect').value=item.category||'mains';$('nameInput').value=item.name?.ka||item.name?.en||item.name?.ru||'';$('descriptionInput').value=item.description?.ka||item.description?.en||item.description?.ru||'';$('priceInput').value=Number(item.price||0);$('glassEnabled').checked=Boolean(item.glassPriceEnabled);$('glassPriceInput').value=item.glassPrice??'';setTranslationInputs(item.name||{},item.description||{});
  $('formTitle').textContent=t('editMode');$('saveButton').querySelector('span:last-child').textContent=t('saveProduct');$('cancelEditButton').hidden=false;
  translationSignature=sourceSignature();setNote('translationStatus','');setNote('formStatus','');updateWineFields();
  if(item.image){$('imagePreviewRow').hidden=false;$('imagePreview').src=item.image;$('imageFileName').textContent=t('selectedImage');}else $('imagePreviewRow').hidden=true;
  $('productForm').scrollIntoView({behavior:'smooth',block:'start'});
}
function compressImage(file){
  return new Promise((resolve,reject)=>{
    if(!file||!file.type.startsWith('image/')){reject(new Error('Not an image'));return;}
    const reader=new FileReader();reader.onerror=()=>reject(new Error('Could not read image'));
    reader.onload=()=>{const img=new Image();img.onerror=()=>reject(new Error('Could not decode image'));img.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(blob=>{if(!blob){reject(new Error('Compression failed'));return;}const fr=new FileReader();fr.onload=()=>resolve({blob,dataUrl:fr.result});fr.onerror=()=>reject(new Error('Image preview failed'));fr.readAsDataURL(blob);},'image/jpeg',.68);};img.src=reader.result;};reader.readAsDataURL(file);
  });
}
function saveLocal(){localStorage.setItem(LOCAL_KEY,JSON.stringify(items));localItems=[...items];}
async function ensureDemoSeeded(){
  if(!firebaseConfigured||remoteItems.length>0)return;
  const batch=writeBatch(db);
  seedItems.forEach(item=>batch.set(doc(db,'menuItems',String(item.id)),item));
  await batch.commit();
  remoteItems=[...seedItems];items=[...seedItems];
}
async function persistItem(product){
  if(firebaseConfigured){
    await ensureDemoSeeded();
    await setDoc(doc(db,'menuItems',String(product.id)),product,{merge:true});
    return;
  }
  const index=items.findIndex(p=>String(p.id)===String(product.id));
  if(index>=0)items[index]=product;else items.unshift(product);
  saveLocal();renderItems();
}
async function uploadSelectedImage(productId, oldUrl=''){
  if(!selectedFile)return oldUrl;
  const compressed=await compressImage(selectedFile);
  // Keep images inside the Firestore document so this prototype can run on the Spark plan.
  // The encoded image is capped well below Firestore's 1 MiB document limit.
  if(firebaseConfigured && compressed.dataUrl.length > 700000)throw new Error('IMAGE_TOO_LARGE');
  return compressed.dataUrl;
}
async function handleSave(event){
  event.preventDefault();
  if(firebaseConfigured&&!currentUser){setNote('formStatus',t('loginRequired'),'error-note');return;}
  if(translationSignature!==sourceSignature()){
    const didTranslate=await translateAll();if(!didTranslate)return;
  }
  const name=getNameMap(),description=getDescriptionMap();
  if(['ka','en','ru'].some(code=>!name[code]||!description[code])){setNote('formStatus',t('fillTranslations'),'error-note');return;}
  const price=Number($('priceInput').value);
  if(!Number.isFinite(price)||price<0){setNote('formStatus',t('saveFail'),'error-note');return;}
  const category=$('categorySelect').value,isWine=category==='wine',glassEnabled=isWine&&$('glassEnabled').checked,glassPrice=Number($('glassPriceInput').value||0);
  if(glassEnabled&&(!Number.isFinite(glassPrice)||glassPrice<=0)){setNote('formStatus',t('saveFail'),'error-note');return;}
  const id=editingId||`item-${(crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`)}`;
  const previous=items.find(p=>String(p.id)===String(id));
  const submit=$('saveButton');submit.disabled=true;setNote('formStatus',t('saving'));
  try{
    const image=await uploadSelectedImage(id,previous?.image||'');
    const product={id,category,active:previous?.active!==false,name,description,price,image,isWine,glassPriceEnabled:glassEnabled,glassPrice:glassEnabled?glassPrice:0,updatedAt:new Date().toISOString()};
    await persistItem(product);
    if(firebaseConfigured){buildList();}
    resetForm();showToast(t('saveSuccess'));setNote('formStatus',t('saveSuccess'),'success');
  }catch(error){console.error(error);const message=error?.message==='IMAGE_TOO_LARGE'?t('photoTooLarge'):t('saveFail');setNote('formStatus',message,'error-note');}
  finally{submit.disabled=false;}
}
async function toggleItem(id){
  const item=items.find(p=>String(p.id)===String(id));if(!item)return;
  if(firebaseConfigured&&!currentUser){showToast(t('loginRequired'));return;}
  const stopping=item.active!==false;
  if(stopping&&!confirm(t('stopConfirm')))return;
  try{
    if(firebaseConfigured)await ensureDemoSeeded();
    const product={...item,active:!stopping,updatedAt:new Date().toISOString()};
    if(firebaseConfigured)await setDoc(doc(db,'menuItems',String(id)),product,{merge:true});
    else{const index=items.findIndex(p=>String(p.id)===String(id));items[index]=product;saveLocal();renderItems();}
    showToast(stopping?t('stopSuccess'):t('activeSuccess'));
  }catch(error){console.error(error);showToast(t('saveFail'));}
}
async function deleteItem(id){
  const item=items.find(p=>String(p.id)===String(id));if(!item)return;
  if(firebaseConfigured&&!currentUser){showToast(t('loginRequired'));return;}
  if(!confirm(t('deleteConfirm')))return;
  try{
    if(firebaseConfigured){await ensureDemoSeeded();await deleteDoc(doc(db,'menuItems',String(id)));}
    else{items=items.filter(p=>String(p.id)!==String(id));saveLocal();renderItems();}
    if(editingId===String(id))resetForm();showToast(t('deleteSuccess'));
  }catch(error){console.error(error);showToast(t('saveFail'));}
}
async function importDemos(){
  if(!firebaseConfigured||!currentUser)return;
  $('importDemoButton').disabled=true;
  try{const batch=writeBatch(db);seedItems.forEach(item=>batch.set(doc(db,'menuItems',String(item.id)),item));await batch.commit();remoteItems=[...seedItems];buildList();showToast(t('importSuccess'));}
  catch(error){console.error(error);showToast(t('importFail'));}
  finally{$('importDemoButton').disabled=false;}
}
function onItemsSnapshot(snapshot){remoteItems=snapshot.docs.map(docSnap=>({id:docSnap.id,...docSnap.data()}));buildList();}
function initFirebase(){
  try{
    firebaseApp=initializeApp(firebaseConfig);auth=getAuth(firebaseApp);db=getFirestore(firebaseApp);
    $('loginCard').hidden=false;$('adminWorkspace').hidden=true;
    onAuthStateChanged(auth,user=>{
      currentUser=user;
      $('loginCard').hidden=Boolean(user);$('adminWorkspace').hidden=!user;$('logoutButton').hidden=!user;
      $('modePill').classList.toggle('connected',Boolean(user));$('modePill').querySelector('span').textContent=t('modeFirebase');
      if(snapshotUnsubscribe){snapshotUnsubscribe();snapshotUnsubscribe=null;}
      if(user){snapshotUnsubscribe=onSnapshot(collection(db,'menuItems'),onItemsSnapshot,error=>{console.error(error);showToast(t('saveFail'));});}
      else{remoteItems=[];buildList();}
      applyLanguage();
    });
  }catch(error){console.error(error);showToast(t('saveFail'));}
}

$('adminLanguage').addEventListener('change',event=>{lang=event.target.value;localStorage.setItem('demo3_admin_language',lang);applyLanguage();});
$('sourceLanguage').addEventListener('change',markSourceChanged);
$('nameInput').addEventListener('input',markSourceChanged);
$('descriptionInput').addEventListener('input',markSourceChanged);
$('translateButton').addEventListener('click',translateAll);
$('categorySelect').addEventListener('change',updateWineFields);
$('glassEnabled').addEventListener('change',updateWineFields);
$('photoInput').addEventListener('change',()=>{
  selectedFile=$('photoInput').files?.[0]||null;
  if(!selectedFile){if(!editingId){$('imagePreviewRow').hidden=true;}return;}
  const allowed=selectedFile.type.startsWith('image/');
  if(!allowed){selectedFile=null;$('photoInput').value='';setNote('formStatus',t('photoTooLarge'),'error-note');return;}
  selectedFilePreview=URL.createObjectURL(selectedFile);$('imagePreview').src=selectedFilePreview;$('imagePreviewRow').hidden=false;$('imageFileName').textContent=selectedFile.name;
});
$('removeImageButton').addEventListener('click',()=>{selectedFile=null;selectedFilePreview='';$('photoInput').value='';$('imagePreview').src='';$('imagePreviewRow').hidden=true;const item=items.find(p=>String(p.id)===String(editingId));if(item)item.image='';});
$('productForm').addEventListener('submit',handleSave);
$('cancelEditButton').addEventListener('click',resetForm);
$('searchInput').addEventListener('input',renderItems);
$('statusFilter').addEventListener('change',renderItems);
$('productList').addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(!button)return;const id=button.dataset.id;switch(button.dataset.action){case'edit':editItem(id);break;case'toggle':toggleItem(id);break;case'delete':deleteItem(id);break;}});
$('importDemoButton').addEventListener('click',importDemos);
$('loginForm').addEventListener('submit',async event=>{event.preventDefault();if(!auth)return;setNote('loginError','');try{await signInWithEmailAndPassword(auth,$('loginEmail').value.trim(),$('loginPassword').value);}catch(error){console.error(error);setNote('loginError',t('loginFail'),'error-note');}});
$('logoutButton').addEventListener('click',async()=>{if(auth)await signOut(auth);});

if(firebaseConfigured){initFirebase();}
else{
  try{const saved=JSON.parse(localStorage.getItem(LOCAL_KEY)||'null');if(Array.isArray(saved))localItems=saved;}catch(error){console.warn(error);}
  buildList();
  const hint=document.createElement('p');hint.id='modeHint';hint.className='list-footnote';hint.textContent=t('demoDataHint');$('productList').after(hint);
  $('modePill').classList.remove('connected');
}
applyLanguage();
