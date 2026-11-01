import { TarotCard } from '../types/tarot';

export const TAROT_DECK: TarotCard[] = [
  // ==========================================
  // BÜYÜK ARKANA (22 KART: 0 - XXI)
  // ==========================================
  {
    id: 'major-00',
    nameTr: 'Deli (Aptal)',
    nameEn: 'The Fool',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 0,
    romanOrRank: '0',
    image: 'cards/major-00.jpg',
    uprightMeaning:
      'Yeni bir başlangıç, saf potansiyel, içsel güvenle bilinmeyene adım atma ve önyargısız deneyim. Hayatın sunduğu serüvene açık bir kalple ve merakla yaklaşmayı simgeler.',
    reversedMeaning:
      'Düşüncesizce alınan riskler, hazırlıksızlık, kararsızlık veya bilinmeyenden duyulan korku nedeniyle ilk adımı atmaktan kaçınma. Aşırı saflık ya da dikkatsizlik uyarısı.',
    symbolicDescription:
      'Pamela Colman Smith çiziminde uçurumun kenarında gökyüzüne bakarak yürüyen genç gezgin; elinde saflığı simgeleyen beyaz gül, omzunda geçmiş deneyimlerini taşıyan küçük çıkın ve yanında sadık beyaz köpek yer alır.',
    keywords: ['Yeni Başlangıç', 'Masumiyet', 'Özgür Ruhu', 'Spontanelik', 'İnanç Adımı', 'Potansiyel'],
  },
  {
    id: 'major-01',
    nameTr: 'Büyücü',
    nameEn: 'The Magician',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 1,
    romanOrRank: 'I',
    image: 'cards/major-01.jpg',
    uprightMeaning:
      'İrade gücü, yaratıcı ustalık, niyeti somut gerçeğe dönüştürme ve sahip olunan kaynakları bilinçle kullanma. Düşünce ile eylem arasındaki güçlü uyumu temsil eder.',
    reversedMeaning:
      'Yeteneklerin boşa harcanması, manipülasyon, odak kaybı, özgüven eksikliği veya planların eyleme dökülememesi. Yanıltıcı vaatlere karşı dikkatli olunması gerektiğini hatırlatır.',
    symbolicDescription:
      'Bir eliyle gökyüzünü, diğer eliyle yeryüzünü işaret eden Büyücü ("Yukarıda ne varsa aşağıda da o vardır"); önündeki masada dört elementi temsil eden Değnek, Kupa, Kılıç ve Tılsım, başının üzerinde sonsuzluk işareti (lemniskat) bulunur.',
    keywords: ['İrade', 'Yaratım', 'Odaklanma', 'Ustalık', 'Kaynaklar', 'Eylem'],
  },
  {
    id: 'major-02',
    nameTr: 'Azize',
    nameEn: 'The High Priestess',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 2,
    romanOrRank: 'II',
    image: 'cards/major-02.jpg',
    uprightMeaning:
      'Derin sezgi, bilinçaltı bilgelik, henüz açığa çıkmamış sırlar ve iç sesi dinleme çağrısı. Dış dünyadaki gürültüden çekilip içsel rehberliğe güvenmeyi öğütler.',
    reversedMeaning:
      'Sezgileri görmezden gelme, yüzeysel değerlendirmeler, bastırılmış duygular veya gizli kalmış gündemler. İçsel sese kulak verilmediğinde oluşan kafa karışıklığı.',
    symbolicDescription:
      'Siyah ve beyaz iki sütun (Boaz ve Jachin) arasında oturan Azize; kucağında kısmen örtülü Tora parşömeni, ayaklarının altında hilal ve arkasında nar desenli gizem perdesi yer alır.',
    keywords: ['Sezgi', 'Gizem', 'Bilinçaltı', 'İçsel Bilgelik', 'Sabır', 'Sükûnet'],
  },
  {
    id: 'major-03',
    nameTr: 'İmparatoriçe',
    nameEn: 'The Empress',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 3,
    romanOrRank: 'III',
    image: 'cards/major-03.jpg',
    uprightMeaning:
      'Bereket, doğurganlık, şefkat, doğayla uyum ve sanatsal yaratıcılık. Fikirlerin, ilişkilerin veya projelerin sevgi ve özenle büyütülüp olgunlaştığı verimli bir dönemi anlatır.',
    reversedMeaning:
      'Yaratıcı tıkanıklık, aşırı korumacılık, kendine bakımı ihmal etme veya duygusal tükenmişlik. Üretkenliğin kesintiye uğraması ve içsel beslenmeye duyulan ihtiyaç.',
    symbolicDescription:
      'On iki yıldızlı tacıyla bereketli buğday tarlaları ve akan şelale önünde oturan İmparatoriçe; yanında Venüs sembollü kalp biçimli kalkan ve bolluğu simgeleyen nar motifli elbise görülür.',
    keywords: ['Bereket', 'Şefkat', 'Yaratıcılık', 'Doğa', 'Bolluk', 'Besleyicilik'],
  },
  {
    id: 'major-04',
    nameTr: 'İmparator',
    nameEn: 'The Emperor',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 4,
    romanOrRank: 'IV',
    image: 'cards/major-04.jpg',
    uprightMeaning:
      'Düzen, yapı, kararlılık, liderlik ve güvenli sınırlar. Kaosun içinden sağlam bir temel kurmayı, stratejik düşünmeyi ve sorumluluk üstlenmeyi simgeler.',
    reversedMeaning:
      'Aşırı katılık, kontrol tutkusu, otorite çatışmaları veya tam tersi olarak disiplinsizlik ve yapı eksikliği. Esneklik ile kararlılık arasındaki dengenin bozulması.',
    symbolicDescription:
      'Koç başlarıyla süslü taş bir tahtta oturan İmparator; sağ elinde yaşamı simgeleyen Ankh asası, sol elinde dünyayı temsil eden küre ve arkasında sarp, kızıl dağlar bulunur.',
    keywords: ['Otorite', 'Düzen', 'İstikrar', 'Strateji', 'Liderlik', 'Güvenlik'],
  },
  {
    id: 'major-05',
    nameTr: 'Aziz',
    nameEn: 'The Hierophant',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 5,
    romanOrRank: 'V',
    image: 'cards/major-05.jpg',
    uprightMeaning:
      'Geleneksel bilgelik, eğitim, rehberlik, manevi değerler ve köklü kurumlar. Bir öğretmenden öğrenmeyi, etik ilkelere bağlılığı ve toplumsal uyumu ifade eder.',
    reversedMeaning:
      'Kalıplaşmış kuralları sorgulama, dogmalardan sıyrılma, kendi özgün yolunu çizme isteği veya körü körüne itaatin yarattığı kısıtlanmışlık hissi.',
    symbolicDescription:
      'İki gri sütun arasında oturan Aziz; üç katlı tacı ve üçlü haç asasıyla önünde diz çökmüş iki öğrenciye elini kutsama hareketiyle kaldırır; ayaklarının önünde çapraz iki anahtar durur.',
    keywords: ['Gelenek', 'Öğreti', 'Maneviyat', 'Rehberlik', 'Etik', 'Aidiyet'],
  },
  {
    id: 'major-06',
    nameTr: 'Âşıklar',
    nameEn: 'The Lovers',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 6,
    romanOrRank: 'VI',
    image: 'cards/major-06.jpg',
    uprightMeaning:
      'Derin sevgi bağı, uyum, değerlerle örtüşen bilinçli bir seçim ve karşılıklı güven. Yalnızca romantik ortaklığı değil, kalp ile aklın birleştiği önemli kararları da simgeler.',
    reversedMeaning:
      'Kararsızlık, değer çatışması, ilişkide uyumsuzluk veya sorumluluktan kaçan seçimler. İçsel bölünmüşlük ve öncelikleri yeniden netleştirme gereksinimi.',
    symbolicDescription:
      'Güneşin altında, Başmelek İsrafil (Raphael) tarafından kutsanan kadın ve erkek figürü; kadının arkasında meyveli bilgi ağacı ve yılan, erkeğin arkasında on iki alevli yaşam ağacı yükselir.',
    keywords: ['Sevgi', 'Uyum', 'Seçim', 'Değerler', 'Ortaklık', 'Bütünleşme'],
  },
  {
    id: 'major-07',
    nameTr: 'Savaş Arabası',
    nameEn: 'The Chariot',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 7,
    romanOrRank: 'VII',
    image: 'cards/major-07.jpg',
    uprightMeaning:
      'Kararlı ilerleyiş, özdenetim, karşıt güçleri tek bir hedefe yönlendirme ve azimle kazanılan başarı. Odaklanmış irade sayesinde engellerin aşılmasını temsil eder.',
    reversedMeaning:
      'Yön kaybı, kontrolün elden kaçması, acelecilik veya içsel çatışmalar nedeniyle ilerleyememe. Gücü zorlamayla değil, dengeyle yönetmek gerektiğini hatırlatır.',
    symbolicDescription:
      'Yıldızlı gölgelik altında zırhlı bir savaşçı; dizgin kullanmadan yalnızca iradesiyle siyah ve beyaz iki sfenksi yönlendirir; arabanın önünde kanatlı güneş diski yer alır.',
    keywords: ['Kararlılık', 'Zafer', 'Özdenetim', 'İlerleme', 'Odak', 'Azim'],
  },
  {
    id: 'major-08',
    nameTr: 'Güç',
    nameEn: 'Strength',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 8,
    romanOrRank: 'VIII',
    image: 'cards/major-08.jpg',
    uprightMeaning:
      'İçsel dayanıklılık, şefkatli cesaret, sabır ve dürtüleri nezaketle dönüştürme gücü. Kaba kuvvetin değil, sakin özgüvenin ve anlayışın gerçek kudret olduğunu vurgular.',
    reversedMeaning:
      'Özşüphe, yorgunluk, sabırsızlık veya öfke ve korku gibi ham duygulara kapılma. Kendi iç gücünü hatırlamaya ve kendine şefkat göstermeye davet eder.',
    symbolicDescription:
      'Başının üzerinde sonsuzluk sembolü taşıyan beyaz elbiseli kadın, kırmızı bir aslanın çenesini zorlamadan, sevgi ve dinginlikle okşayarak sakinleştirir; belinde çiçeklerden bir kuşak vardır.',
    keywords: ['İçsel Güç', 'Cesaret', 'Şefkat', 'Sabır', 'Dayanıklılık', 'Özdenetim'],
  },
  {
    id: 'major-09',
    nameTr: 'Ermiş',
    nameEn: 'The Hermit',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 9,
    romanOrRank: 'IX',
    image: 'cards/major-09.jpg',
    uprightMeaning:
      'İçe dönüş, tefekkür, bilgelik arayışı ve dış dünyanın karmaşasından bilinçli bir süreliğine uzaklaşma. Kendi gerçeğini bulmak için sessizliği dinleme zamanı.',
    reversedMeaning:
      'Aşırı yalnızlaşma, insanlardan kopukluk, içe bakıştan kaçınma veya bilgece tavsiyeleri reddetme. İnziva ile soyutlanma arasındaki ince çizgiye dikkat çeker.',
    symbolicDescription:
      'Karlı bir dağ zirvesinde gri peleriniyle duran yaşlı bilge; bir elinde içinde altı köşeli hakikat yıldızı parlayan feneri, diğer elinde kendisine destek olan uzun asayı tutar.',
    keywords: ['İçe Dönüş', 'Bilgelik', 'Tefekkür', 'Rehber Işık', 'Sadelik', 'Arayış'],
  },
  {
    id: 'major-10',
    nameTr: 'Kader Çarkı',
    nameEn: 'Wheel of Fortune',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 10,
    romanOrRank: 'X',
    image: 'cards/major-10.jpg',
    uprightMeaning:
      'Yaşam döngüleri, beklenmedik dönüşümler, yeni fırsatlar ve değişimin doğal akışı. Her şeyin hareket halinde olduğunu ve değişime uyum sağlamanın önemini anlatır.',
    reversedMeaning:
      'Değişime direnç gösterme, gecikmeler, talihsizlik hissi veya tekrar eden döngülerde sıkışıp kalma. Çarkın merkezindeki dinginliği bulma çağrısı.',
    symbolicDescription:
      'Gökyüzünde dönen, üzerinde TARO/ROTA harfleri ve simya sembolleri bulunan çark; üstünde kılıçlı mavi sfenks, yanlarında Yılan ve Anubis, köşelerde ise dört sabit burcu temsil eden kanatlı figürler kitap okur.',
    keywords: ['Döngüler', 'Değişim', 'Kader Akışı', 'Dönüm Noktası', 'Uyum', 'Hareket'],
  },
  {
    id: 'major-11',
    nameTr: 'Adalet',
    nameEn: 'Justice',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 11,
    romanOrRank: 'XI',
    image: 'cards/major-11.jpg',
    uprightMeaning:
      'Denge, dürüstlük, neden-sonuç yasası, tarafsız değerlendirme ve hakkaniyet. Verilen kararların sorumluluğunu üstlenmeyi ve gerçeğe sadık kalmayı simgeler.',
    reversedMeaning:
      'Önyargı, dengesizlik, sorumluluktan kaçma veya adil olmayan bir durum hissi. Karar verirken duygusal çarpıtmalardan arınıp nesnel bakış açısına dönme ihtiyacı.',
    symbolicDescription:
      'Mor perde önünde oturan Adalet figürü; sağ elinde keskin netliği temsil eden çift ağızlı kılıcı dik tutar, sol elinde ise eşitliği ve tartıyı simgeleyen altın teraziyi dengeler.',
    keywords: ['Denge', 'Hakkaniyet', 'Gerçek', 'Neden-Sonuç', 'Dürüstlük', 'Sorumluluk'],
  },
  {
    id: 'major-12',
    nameTr: 'Asılan Adam',
    nameEn: 'The Hanged Man',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 12,
    romanOrRank: 'XII',
    image: 'cards/major-12.jpg',
    uprightMeaning:
      'Olaylara bambaşka bir açıdan bakma, bilinçli bekleyiş, teslimiyet ve daha yüksek bir kavrayış için eski alışkanlıkları bırakma. Duraksamanın getirdiği içsel aydınlanma.',
    reversedMeaning:
      'Boşa kürek çekme, gereksiz özveri, inatla direnme veya kararsızlık yüzünden erteleme. Değişmesi gereken bakış açısını görmekte zorlanma.',
    symbolicDescription:
      'Canlı yapraklı T biçimli bir ağaçtan tek ayağıyla baş aşağı asılı duran figür; yüzü son derece huzurludur ve başının çevresinde parlak bir aydınlanma halesi ışıldar.',
    keywords: ['Yeni Bakış Açısı', 'Teslimiyet', 'Duraksama', 'Farkındalık', 'Fedakârlık', 'Akışa Güven'],
  },
  {
    id: 'major-13',
    nameTr: 'Ölüm',
    nameEn: 'Death',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 13,
    romanOrRank: 'XIII',
    image: 'cards/major-13.jpg',
    uprightMeaning:
      'Köklü dönüşüm, bir dönemin doğal sonu ve yeninin doğabilmesi için işlevini yitirenin geride bırakılması. Fiziksel ölümü değil, yenilenmeye kapı açan kaçınılmaz geçişi temsil eder.',
    reversedMeaning:
      'Biten bir sürece tutunma, değişim korkusu, geçmişi bırakamama ve bu nedenle yaşanan durağanlık. Doğal dönüşüm sürecine güvenme çağrısı.',
    symbolicDescription:
      'Beyaz bir at üzerinde siyah zırhlı iskelet şövalye, üzerinde beş yapraklı beyaz mistik gül bulunan siyah sancağı taşır; ufukta iki kule arasından yeni bir güneş doğmaktadır.',
    keywords: ['Dönüşüm', 'Kapanış', 'Yenilenme', 'Bırakma', 'Geçiş', 'Yeniden Doğuş'],
  },
  {
    id: 'major-14',
    nameTr: 'Denge',
    nameEn: 'Temperance',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 14,
    romanOrRank: 'XIV',
    image: 'cards/major-14.jpg',
    uprightMeaning:
      'Ölçülülük, içsel huzur, karşıt unsurların uyumlu sentezi ve sabırlı şifa. Aşırılıklardan uzak durarak orta yolu bulmayı ve ruhsal dengeyi korumayı anlatır.',
    reversedMeaning:
      'Aşırılık, sabırsızlık, uyumsuzluk veya enerjinin dağılması. Yaşamın farklı alanları arasındaki dengenin yeniden kurulması gerektiğini işaret eder.',
    symbolicDescription:
      'Bir ayağı suda, bir ayağı karada duran kanatlı melek; iki altın kupa arasında suyu akışkan biçimde birbirine aktarır; göğsünde karenin içinde üçgen sembolü, ufukta ise taç şeklinde parlayan güneş görülür.',
    keywords: ['Ölçülülük', 'Şifa', 'Sentez', 'Uyum', 'Sabır', 'İç Huzur'],
  },
  {
    id: 'major-15',
    nameTr: 'Şeytan',
    nameEn: 'The Devil',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 15,
    romanOrRank: 'XV',
    image: 'cards/major-15.jpg',
    uprightMeaning:
      'Gölge yönlerle yüzleşme, bağımlılıklar, aşırı maddiyatçılık veya kişinin kendi yarattığı kısıtlayıcı inançlar. Boyundaki zincirlerin gevşek olduğunu ve özgürleşmenin mümkün olduğunu hatırlatır.',
    reversedMeaning:
      'Zincirleri kırma, bağımlılık veya sağlıksız bir döngüden özgürleşme, farkındalık kazanma ve kendi gücünü geri alma süreci.',
    symbolicDescription:
      'Siyah bir kaide üzerinde ters pentagramlı boynuzlu figür; kaidenin önünde boyunlarından gevşek zincirlerle bağlı kadın ve erkek figürü yer alır; zincirler istendiğinde çıkarılabilecek kadar geniştir.',
    keywords: ['Gölge Benlik', 'Tutku', 'Bağımlılık', 'Kısıtlamalar', 'Yüzleşme', 'Özgürleşme İhtiyacı'],
  },
  {
    id: 'major-16',
    nameTr: 'Yıkılan Kule',
    nameEn: 'The Tower',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 16,
    romanOrRank: 'XVI',
    image: 'cards/major-16.jpg',
    uprightMeaning:
      'Sahte temellerin sarsılması, ani aydınlanma, beklenmedik değişim ve yanılsamaların yıkılışı. İlk anda sarsıcı görünse de gerçeğin ortaya çıkmasını ve özgürleşmeyi sağlar.',
    reversedMeaning:
      'Kaçınılmaz bir değişimi ertelemeye çalışma, sarsıntının etkisini içsel olarak yaşama veya krizi daha hafif atlatma çabası.',
    symbolicDescription:
      'Sarp bir kayalık üzerindeki yüksek kuleye çakan şimşek, kulenin üzerindeki altın tacı devirir; karanlık gökyüzünde 22 ateş damlası (Yod) parıldar.',
    keywords: ['Ani Değişim', 'Uyanış', 'Yanılsamaların Yıkılışı', 'Gerçek', 'Özgürleşme', 'Yeniden İnşa'],
  },
  {
    id: 'major-17',
    nameTr: 'Yıldız',
    nameEn: 'The Star',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 17,
    romanOrRank: 'XVII',
    image: 'cards/major-17.jpg',
    uprightMeaning:
      'Umut, ilham, ruhsal yenilenme, sükûnet ve geleceğe duyulan berrak güven. Fırtınanın ardından gelen dinginliği, şifayı ve içsel ışığın parlamasını temsil eder.',
    reversedMeaning:
      'Umutsuzluk, ilham kaybı, karamsarlık veya kendi potansiyeline olan inancın zayıflaması. İçsel şifa kaynağıyla yeniden bağ kurma daveti.',
    symbolicDescription:
      'Gece göğünde sekiz köşeli büyük sarı yıldız ve yedi küçük beyaz yıldız altında, bir dizini toprağa koymuş figür iki testiden birini suya, diğerini bereketli toprağa döker; arkadaki ağaçta İbis kuşu durur.',
    keywords: ['Umut', 'Şifa', 'İlham', 'Huzur', 'Yenilenme', 'Güven'],
  },
  {
    id: 'major-18',
    nameTr: 'Ay',
    nameEn: 'The Moon',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 18,
    romanOrRank: 'XVIII',
    image: 'cards/major-18.jpg',
    uprightMeaning:
      'Bilinçaltı derinlikler, rüyalar, belirsizlik, yanılsamalar ve sezgisel algı. Her şeyin göründüğü gibi olmayabileceğini, korkularla sezgileri ayırt etmek gerektiğini anlatır.',
    reversedMeaning:
      'Sislerin dağılması, gizli kalan bir durumun aydınlanması, kafa karışıklığının sona ermesi veya bastırılmış korkuların aşılması.',
    symbolicDescription:
      'İki kule arasında uzanan kıvrımlı patika; gökyüzünde hem hilal hem dolunay barındıran Ay; sudan çıkan kerevit (derin bilinçaltı) ve aya uluyan evcil köpek ile vahşi kurt görülür.',
    keywords: ['Rüyalar', 'Sezgi', 'Belirsizlik', 'Yanılsama', 'Bilinçaltı', 'Derinlik'],
  },
  {
    id: 'major-19',
    nameTr: 'Güneş',
    nameEn: 'The Sun',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 19,
    romanOrRank: 'XIX',
    image: 'cards/major-19.jpg',
    uprightMeaning:
      'Yaşam sevinci, berraklık, başarı, sıcaklık ve içtenlik. Karanlık ve şüphelerin dağıldığı, enerjinin ve iyimserliğin zirveye ulaştığı aydınlık bir dönemi müjdeler.',
    reversedMeaning:
      'Geçici bulutlanma, sevinci erteleme, aşırı beklenti veya başarının tadını çıkaramama. Olumlu potansiyelin hâlâ mevcut olduğunu, sadece bakışın aydınlanması gerektiğini gösterir.',
    symbolicDescription:
      'Parlak güneşin altında beyaz bir atın üzerinde kollarını açmış neşeli çocuk; taş duvarın ardında güneşe dönük dört büyük ayçiçeği ve çocuğun elinde dalgalanan turuncu-kırmızı sancak yer alır.',
    keywords: ['Neşe', 'Aydınlanma', 'Başarı', 'Canlılık', 'Netlik', 'İyimserlik'],
  },
  {
    id: 'major-20',
    nameTr: 'Mahkeme (Uyanış)',
    nameEn: 'Judgement',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 20,
    romanOrRank: 'XX',
    image: 'cards/major-20.jpg',
    uprightMeaning:
      'Ruhsal uyanış, geçmişi değerlendirip affetme, içsel çağrıya kulak verme ve yeni bir bilinç düzeyine geçiş. Önemli bir farkındalık ve arınma eşiğini simgeler.',
    reversedMeaning:
      'Kendini aşırı yargılama, geçmiş pişmanlıklara takılıp kalma, içsel çağrıyı duymazdan gelme veya karar vermekten çekinme.',
    symbolicDescription:
      'Bulutların arasından borusunu üfleyen Başmelek Cebrail (Gabriel); aşağıda kollarını gökyüzüne açarak uyanan ve yükselen kadın, erkek ve çocuk figürleri görülür.',
    keywords: ['Uyanış', 'Arınma', 'İçsel Çağrı', 'Affediş', 'Yeniden Doğuş', 'Muhasebe'],
  },
  {
    id: 'major-21',
    nameTr: 'Dünya',
    nameEn: 'The World',
    arcana: 'major',
    arcanaLabelTr: 'Büyük Arkana',
    suit: 'none',
    suitLabelTr: 'Büyük Arkana',
    number: 21,
    romanOrRank: 'XXI',
    image: 'cards/major-21.jpg',
    uprightMeaning:
      'Tamamlanma, bütünlük, uzun bir yolculuğun başarıyla taçlanması ve evrenle uyum. Bir döngünün doygunlukla kapanıp daha yüksek bir döngüye hazırlanmasını temsil eder.',
    reversedMeaning:
      'Yarım kalmış işler, kapanış eksikliği, son adımı atmaktan kaçınma veya hedefe çok yakınken yaşanan gecikme.',
    symbolicDescription:
      'Kırmızı kurdelelerle bağlı yeşil defne çelengi içinde dans eden figür; iki elinde iki kristal asa tutar; köşelerde dört elementi ve sabit burçları temsil eden İnsan, Kartal, Boğa ve Aslan yer alır.',
    keywords: ['Tamamlanma', 'Bütünlük', 'Başarı', 'Uyum', 'Doyum', 'Evrensellik'],
  },

  // ==========================================
  // DEĞNEKLER (WANDS: 1 - 14 / ATEŞ ELEMENTİ)
  // ==========================================
  {
    id: 'wands-01',
    nameTr: 'Değnek Ası',
    nameEn: 'Ace of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 1,
    romanOrRank: 'As',
    image: 'cards/wands-01.jpg',
    uprightMeaning:
      'Yaratıcı kıvılcım, coşkulu bir başlangıç, ilham, cesaret ve harekete geçme arzusu. Yeni bir fikir veya projenin güçlü bir yaşam enerjisiyle filizlenmesini simgeler.',
    reversedMeaning:
      'Motivasyon eksikliği, geciken başlangıçlar, yaratıcı blokaj veya enerjinin yönsüz kalması. Kıvılcımı yeniden alevlendirmek için dinlenme ve odaklanma ihtiyacı.',
    symbolicDescription:
      'Bulutların arasından uzanan parlak bir el, üzerinde taze yeşil yapraklar filizlenen güçlü bir değneği kavrar; arka planda nehir, ağaçlar ve uzaktaki bir kale görülür.',
    keywords: ['İlham', 'Yaratıcı Kıvılcım', 'Başlangıç', 'Tutku', 'Canlılık', 'Potansiyel'],
  },
  {
    id: 'wands-02',
    nameTr: 'Değnek İkilisi',
    nameEn: 'Two of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 2,
    romanOrRank: '2',
    image: 'cards/wands-02.jpg',
    uprightMeaning:
      'Gelecek planlaması, ufku genişletme, uzun vadeli vizyon ve konfor alanından çıkma kararı. Elindeki olanakları değerlendirip bir sonraki adımı stratejik olarak tasarlama.',
    reversedMeaning:
      'Bilinmeyenden korkma, plansızlık, güvenli alana aşırı bağlılık veya seçenekler arasında kararsız kalma.',
    symbolicDescription:
      'Kale burcunda duran pelerinli bir figür, sağ avucunda küçük bir dünya küresi tutarken sol eliyle bir değneği kavrar ve geniş denize, dağlara doğru bakar.',
    keywords: ['Vizyon', 'Planlama', 'Keşif', 'Karar', 'Genişleyen Ufuklar', 'Öngörü'],
  },
  {
    id: 'wands-03',
    nameTr: 'Değnek Üçlüsü',
    nameEn: 'Three of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 3,
    romanOrRank: '3',
    image: 'cards/wands-03.jpg',
    uprightMeaning:
      'Atılan adımların ilk meyvelerini görme, genişleme, işbirliği ve geleceğe güvenle bakma. Yola çıkmış çabaların ufukta somut sonuçlar getirmeye başladığını gösterir.',
    reversedMeaning:
      'Beklenen sonuçlarda gecikme, dar görüşlülük, iletişim aksaklıkları veya planların yeniden gözden geçirilmesi gerekliliği.',
    symbolicDescription:
      'Yüksek bir kayalıkta üç değnek arasında duran figür, altın sarısı denizde ilerleyen yelkenli gemileri izler; sırtı izleyiciye dönük, yüzü ufka çevrilidir.',
    keywords: ['Genişleme', 'İlerleme', 'Öngörü', 'Fırsatlar', 'Ticaret ve İşbirliği', 'Ufuk'],
  },
  {
    id: 'wands-04',
    nameTr: 'Değnek Dörtlüsü',
    nameEn: 'Four of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 4,
    romanOrRank: '4',
    image: 'cards/wands-04.jpg',
    uprightMeaning:
      'Kutlama, yuva sıcaklığı, huzurlu birliktelik ve önemli bir aşamanın başarıyla tamamlanması. Sevdiklerle paylaşılan neşeyi ve güvenli bir temeli simgeler.',
    reversedMeaning:
      'Geçici huzursuzluk, ertelenen kutlamalar, ev veya ortam içinde iletişim kopukluğu ya da aidiyet hissinde dalgalanma.',
    symbolicDescription:
      'Çiçek ve meyve çelenkleriyle süslenmiş dört yüksek değnek altında çiçek demetleri sallayarak kutlama yapan iki figür; arka planda görkemli bir şato yer alır.',
    keywords: ['Kutlama', 'Yuva', 'Uyum', 'Sevinç', 'İstikrar', 'Birliktelik'],
  },
  {
    id: 'wands-05',
    nameTr: 'Değnek Beşlisi',
    nameEn: 'Five of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 5,
    romanOrRank: '5',
    image: 'cards/wands-05.jpg',
    uprightMeaning:
      'Fikir ayrılıkları, tatlı-sert rekabet, farklı enerjilerin çarpışması ve dinamik tartışma ortamı. Çatışmanın yıkıcı değil, doğru yönetildiğinde geliştirici olabileceğini gösterir.',
    reversedMeaning:
      'Çatışmadan kaçınma, içsel gerginlik, gereksiz tartışmaların sönümlenmesi veya uzlaşma arayışı.',
    symbolicDescription:
      'Farklı renklerde giyinmiş beş genç figür, ellerindeki değnekleri havada birbirine çaprazlayarak enerjik bir mücadele ya da antrenman sergiler.',
    keywords: ['Rekabet', 'Fikir Çatışması', 'Dinamizm', 'Mücadele', 'Farklı Sesler', 'Enerji Dağınıklığı'],
  },
  {
    id: 'wands-06',
    nameTr: 'Değnek Altılısı',
    nameEn: 'Six of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 6,
    romanOrRank: '6',
    image: 'cards/wands-06.jpg',
    uprightMeaning:
      'Başarı, takdir edilme, özgüven artışı ve verilen emeğin çevreden karşılık bulması. Zorlu bir sürecin ardından gelen hak edilmiş görünürlüğü temsil eder.',
    reversedMeaning:
      'Takdir görememe kaygısı, kibir, geçici özgüven düşüşü veya başkalarının onayına aşırı bağımlı olma.',
    symbolicDescription:
      'Başında defne çelengi olan bir binici, beyaz atı üzerinde ucunda çelenk asılı bir değnek taşır; çevresindeki kalabalık beş değnekle ona eşlik ederek başarıyı kutlar.',
    keywords: ['Zafer', 'Takdir', 'Özgüven', 'Başarı', 'Tanınma', 'Onur'],
  },
  {
    id: 'wands-07',
    nameTr: 'Değnek Yedilisi',
    nameEn: 'Seven of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 7,
    romanOrRank: '7',
    image: 'cards/wands-07.jpg',
    uprightMeaning:
      'Kendi duruşunu ve ilkelerini kararlılıkla savunma, zorluklar karşısında geri adım atmama ve avantajlı konumu koruma. Cesaret ve sebatla sınırlarını koruma zamanı.',
    reversedMeaning:
      'Savunmada kalmaktan yorulma, bunalmışlık hissi, kolayca pes etme veya gereksiz yere her şeyi tehdit olarak algılama.',
    symbolicDescription:
      'Bir tepenin üzerinde duran figür, aşağıdan kendisine doğru uzanan altı değneğe karşı elindeki değnekle kararlı bir savunma duruşu sergiler.',
    keywords: ['Savunma', 'Kararlılık', 'Sınırları Koruma', 'Cesaret', 'Sebat', 'Direnç'],
  },
  {
    id: 'wands-08',
    nameTr: 'Değnek Sekizlisi',
    nameEn: 'Eight of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 8,
    romanOrRank: '8',
    image: 'cards/wands-08.jpg',
    uprightMeaning:
      'Hızlı gelişmeler, beklenen haberlerin gelmesi, ivme kazanma ve engellerin ortadan kalkması. Olayların hızla akmaya başladığı dinamik bir süreci ifade eder.',
    reversedMeaning:
      'Gecikmeler, aceleci kararlar yüzünden yapılan hatalar, iletişimde karışıklık veya hızın kontrolsüzleşmesi.',
    symbolicDescription:
      'Açık ve berrak bir gökyüzünde, nehir ve yeşil tepelerin üzerinden aynı yönde paralel olarak hızla süzülen sekiz filizlenmiş değnek görülür.',
    keywords: ['Hız', 'İletişim', 'İvme', 'Haberler', 'Akış', 'Netlik'],
  },
  {
    id: 'wands-09',
    nameTr: 'Değnek Dokuzlusu',
    nameEn: 'Nine of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 9,
    romanOrRank: '9',
    image: 'cards/wands-09.jpg',
    uprightMeaning:
      'Yorgunluğa rağmen pes etmeme, son düzlükte dayanıklılık, geçmiş deneyimlerden ders çıkararak temkinli olma. Hedefe çok az kaldığını ve içsel direncin korunduğunu gösterir.',
    reversedMeaning:
      'Tükenmişlik, aşırı şüphecilik, inatçı savunmacılık veya dinlenmeye izin vermeme.',
    symbolicDescription:
      'Başı sargılı bir figür, arkasında çit gibi dizilmiş sekiz değneğin önünde elindeki dokuzuncu değneğe yaslanarak dikkatle çevreyi gözlemler.',
    keywords: ['Dayanıklılık', 'Sebat', 'Temkin', 'Son Düzlük', 'Tecrübe', 'Direnç'],
  },
  {
    id: 'wands-10',
    nameTr: 'Değnek Onlusu',
    nameEn: 'Ten of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 10,
    romanOrRank: '10',
    image: 'cards/wands-10.jpg',
    uprightMeaning:
      'Ağır sorumluluklar, tek başına üstlenilen yükler ve hedefe ulaşmak için harcanan yoğun emek. Başarıya yakın olunsa da yükleri paylaşmanın ve önceliklendirmenin önemini hatırlatır.',
    reversedMeaning:
      'Yükleri bırakma veya paylaşma, tükenmişliği fark etme ya da kendisine ait olmayan sorumlulukları taşımaktan vazgeçme.',
    symbolicDescription:
      'Kucağında on uzun değneği güçlükle kucaklayıp iki büklüm eğilerek uzaktaki kasabaya doğru yürüyen bir figür betimlenir.',
    keywords: ['Sorumluluk', 'Ağır Yük', 'Yoğun Çaba', 'Yorgunluk', 'Azim', 'Görev Bilinci'],
  },
  {
    id: 'wands-11',
    nameTr: 'Değnek Prensi',
    nameEn: 'Page of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 11,
    romanOrRank: 'Prens',
    image: 'cards/wands-11.jpg',
    uprightMeaning:
      'Heyecan verici bir haber, merak, öğrenme hevesi ve yaratıcı bir fikrin ilk filizi. Hayata çocuksu bir coşku ve keşif arzusuyla yaklaşmayı simgeler.',
    reversedMeaning:
      'Hevesin çabuk sönmesi, odak dağınıklığı, geciken haberler veya ne yöne gideceğini bilememe.',
    symbolicDescription:
      'Çöl manzarasında üzerinde semender motifleri bulunan sarı tunikli genç bir figür, elindeki filizlenen değneğe hayranlık ve merakla bakar.',
    keywords: ['Merak', 'Heves', 'Yeni Haber', 'Keşif', 'Yaratıcı Fikir', 'Genç Enerji'],
  },
  {
    id: 'wands-12',
    nameTr: 'Değnek Şövalyesi',
    nameEn: 'Knight of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 12,
    romanOrRank: 'Şövalye',
    image: 'cards/wands-12.jpg',
    uprightMeaning:
      'Cesur atılım, macera tutkusu, yüksek enerji ve tutkuların peşinden korkusuzca gitme. Hareketin, değişimin ve girişimciliğin güçlü temsilcisidir.',
    reversedMeaning:
      'Sabırsızlık, düşünmeden hareket etme, yarıda bırakılan işler veya öfkeyle verilen tepkiler.',
    symbolicDescription:
      'Şaha kalkmış kızıl bir at üzerinde, miğferi ve tuniği alev ve semender motifleriyle bezeli şövalye elinde değneğiyle ileri atılır.',
    keywords: ['Atılım', 'Macera', 'Cesaret', 'Tutku', 'Hareket', 'Girişim'],
  },
  {
    id: 'wands-13',
    nameTr: 'Değnek Kraliçesi',
    nameEn: 'Queen of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 13,
    romanOrRank: 'Kraliçe',
    image: 'cards/wands-13.jpg',
    uprightMeaning:
      'Sıcakkanlı özgüven, karizma, bağımsızlık, yaratıcı üretkenlik ve ilham veren liderlik. Hem kendi ışığını parlatan hem de çevresini yüreklendiren olgun bir enerjiyi anlatır.',
    reversedMeaning:
      'Özgüven dalgalanması, kıskançlık, aşırı baskın olma eğilimi veya içsel enerjinin geri çekilmesi.',
    symbolicDescription:
      'Aslan motifli tahtta oturan Kraliçe; bir elinde değnek, diğer elinde canlı bir ayçiçeği tutar; ayaklarının dibinde sezgiyi ve bağımsızlığı simgeleyen siyah bir kedi oturur.',
    keywords: ['Karizma', 'Özgüven', 'Sıcaklık', 'Bağımsızlık', 'Yaratıcılık', 'Canlılık'],
  },
  {
    id: 'wands-14',
    nameTr: 'Değnek Kralı',
    nameEn: 'King of Wands',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'wands',
    suitLabelTr: 'Değnekler',
    number: 14,
    romanOrRank: 'Kral',
    image: 'cards/wands-14.jpg',
    uprightMeaning:
      'Vizyoner liderlik, girişimci bilgelik, cesur kararlar ve büyük resmi görerek ilham verme. Tutkuyu disiplin ve deneyimle birleştiren olgun otoriteyi simgeler.',
    reversedMeaning:
      'Otoriterlik, sabırsızlık, gerçekçi olmayan beklentiler veya vizyon eksikliği.',
    symbolicDescription:
      'Aslan ve kendi kuyruğunu ısıran semender motifli tahtta oturan Kral; elinde çiçeklenen asasını tutar, omuzlarında aslan pelerini ve başında alev biçimli taç bulunur.',
    keywords: ['Vizyoner Liderlik', 'Girişimcilik', 'Cesaret', 'İlham', 'Olgun Güç', 'Strateji'],
  },

  // ==========================================
  // KUPALAR (CUPS: 1 - 14 / SU ELEMENTİ)
  // ==========================================
  {
    id: 'cups-01',
    nameTr: 'Kupa Ası',
    nameEn: 'Ace of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 1,
    romanOrRank: 'As',
    image: 'cards/cups-01.jpg',
    uprightMeaning:
      'Kalbin açılması, saf sevgi, duygusal yenilenme, şefkat ve derin sezgisel akış. Yeni bir duygusal bağın veya ruhsal huzurun doğuşunu temsil eder.',
    reversedMeaning:
      'Duyguları bastırma, kırgınlık nedeniyle kalbi kapatma, duygusal boşluk hissi veya özsevgi eksikliği.',
    symbolicDescription:
      'Bulutlardan uzanan elin tuttuğu altın kupadan beş su akıntısı nilüferli göle dökülür; yukarıdan beyaz bir güvercin kupaya doğru süzülür.',
    keywords: ['Saf Sevgi', 'Duygusal Yenilenme', 'Şefkat', 'Sezgi', 'Bereket', 'Kalp Açıklığı'],
  },
  {
    id: 'cups-02',
    nameTr: 'Kupa İkilisi',
    nameEn: 'Two of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 2,
    romanOrRank: '2',
    image: 'cards/cups-02.jpg',
    uprightMeaning:
      'Karşılıklı sevgi ve saygı, derin anlayış, ruhsal uyum ve dengeli ortaklık. İki kalbin veya iki fikrin eşitlik içinde buluşmasını simgeler.',
    reversedMeaning:
      'İletişim kopukluğu, duygusal dengesizlik, yanlış anlaşılmalar veya ilişkide uyumun yeniden kurulması ihtiyacı.',
    symbolicDescription:
      'Birbirine kupalarını uzatan kadın ve erkek figürü; kupaların üzerinde iki yılanlı Hermes asası (Caduceus) ve kanatlı kırmızı aslan başı yükselir.',
    keywords: ['Karşılıklı Bağ', 'Uyum', 'Ortaklık', 'Romantizm', 'Güven', 'Eşitlik'],
  },
  {
    id: 'cups-03',
    nameTr: 'Kupa Üçlüsü',
    nameEn: 'Three of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 3,
    romanOrRank: '3',
    image: 'cards/cups-03.jpg',
    uprightMeaning:
      'Dostluk, dayanışma, neşeli paylaşımlar ve ortak başarıların kutlanması. Samimi sosyal bağların ve destekleyici topluluk enerjisinin verdiği mutluluğu anlatır.',
    reversedMeaning:
      'Sosyal yorgunluk, yüzeysel ilişkiler, dedikodu veya yalnız kalma ihtiyacı.',
    symbolicDescription:
      'Çiçekler ve balkabaklarıyla dolu bereketli bir bahçede, kupalarını neşeyle havaya kaldırarak dans eden üç kadın figürü görülür.',
    keywords: ['Dostluk', 'Kutlama', 'Dayanışma', 'Paylaşım', 'Neşe', 'Topluluk'],
  },
  {
    id: 'cups-04',
    nameTr: 'Kupa Dörtlüsü',
    nameEn: 'Four of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 4,
    romanOrRank: '4',
    image: 'cards/cups-04.jpg',
    uprightMeaning:
      'Duygusal durgunluk, içe kapanma, mevcut olanaklara karşı isteksizlik veya tatminsizlik. Elindekilere odaklanırken yeni sunulan fırsatı fark edememe uyarısı.',
    reversedMeaning:
      'Durgunluktan uyanış, yeni olasılıklara yeniden ilgi duyma, kabuğundan çıkma ve taze bir motivasyon.',
    symbolicDescription:
      'Bir ağacın altında kollarını kavuşturmuş oturan genç, önündeki üç kupaya dalgınlıkla bakarken buluttan uzanan dördüncü kupayı fark etmez.',
    keywords: ['İçe Kapanma', 'Doyumsuzluk', 'Durgunluk', 'Fırsatı Görmeme', 'Tefekkür', 'İsteksizlik'],
  },
  {
    id: 'cups-05',
    nameTr: 'Kupa Beşlisi',
    nameEn: 'Five of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 5,
    romanOrRank: '5',
    image: 'cards/cups-05.jpg',
    uprightMeaning:
      'Hayal kırıklığı, kayıp üzüntüsü ve geçmişte dökülenlere odaklanma. Ancak hemen arkada hâlâ dimdik duran iki kupanın ve umudun varlığını hatırlatır.',
    reversedMeaning:
      'Üzüntüyü geride bırakıp iyileşmeye yönelme, kalan güzellikleri fark etme, kabulleniş ve ileriye bakma.',
    symbolicDescription:
      'Siyah pelerinli bir figür başını eğmiş önünde devrilmiş üç kupaya bakarken, hemen arkasında iki kupa dik durmakta ve nehir üzerindeki köprü kaleye ulaşmaktadır.',
    keywords: ['Hüzün', 'Kayıp Algısı', 'Pişmanlık', 'Kalan Umut', 'Kabulleniş', 'İyileşme Süreci'],
  },
  {
    id: 'cups-06',
    nameTr: 'Kupa Altılısı',
    nameEn: 'Six of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 6,
    romanOrRank: '6',
    image: 'cards/cups-06.jpg',
    uprightMeaning:
      'Nostalji, çocukluk anıları, masumiyet, içten şefkat ve geçmişten gelen sıcak bir bağ. Saf ve karşılıksız paylaşımın getirdiği huzuru simgeler.',
    reversedMeaning:
      'Geçmişe aşırı takılıp bugünü kaçırma, geçmişi olduğundan farklı idealleştirme veya artık büyüme ve geleceğe adım atma zamanı.',
    symbolicDescription:
      'Sıcak bir köy avlusunda küçük bir erkek çocuk, beyaz çiçeklerle dolu altın kupayı küçük bir kız çocuğuna sevgiyle uzatır; çevrede çiçekli beş kupa daha vardır.',
    keywords: ['Nostalji', 'Masumiyet', 'Anılar', 'Şefkat', 'İç Çocuk', 'Sadakat'],
  },
  {
    id: 'cups-07',
    nameTr: 'Kupa Yedilisi',
    nameEn: 'Seven of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 7,
    romanOrRank: '7',
    image: 'cards/cups-07.jpg',
    uprightMeaning:
      'Çok sayıda seçenek, zengin hayal gücü, arzular ve yanılsamalar. Hayaller ile gerçekçi olanı ayırt edip somut bir seçim yapma gerekliliğini vurgular.',
    reversedMeaning:
      'Kafa karışıklığının dağılması, gerçekçi bir tercihe odaklanma veya hayal dünyasından somut zemine iniş.',
    symbolicDescription:
      'Karanlık bir silüet, bulutların üzerinde beliren ve içlerinde şato, mücevher, çelenk, ejderha, örtülü figür ve yılan bulunan yedi kupayı izler.',
    keywords: ['Seçenekler', 'Hayal Gücü', 'Kararsızlık', 'Yanılsama', 'Arzular', 'Netleşme İhtiyacı'],
  },
  {
    id: 'cups-08',
    nameTr: 'Kupa Sekizlisi',
    nameEn: 'Eight of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 8,
    romanOrRank: '8',
    image: 'cards/cups-08.jpg',
    uprightMeaning:
      'Artık ruhsal doyum vermeyen bir durumu geride bırakıp daha derin bir anlam arayışına çıkma. Duygusal olgunlukla alınan ayrılış ve içsel yolculuk kararı.',
    reversedMeaning:
      'Gitmek ile kalmak arasında bocalama, konfor alanını terk etme korkusu veya yarım kalan bir konuya geri dönüş.',
    symbolicDescription:
      'Kırmızı pelerinli bir gezgin, özenle dizilmiş sekiz kupayı arkasında bırakarak ay ışığı altında sarp dağlara doğru asasıyla yürür.',
    keywords: ['Geride Bırakma', 'Anlam Arayışı', 'İçsel Yolculuk', 'Dönüşüm', 'Farkındalık', 'Cesur Karar'],
  },
  {
    id: 'cups-09',
    nameTr: 'Kupa Dokuzlusu',
    nameEn: 'Nine of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 9,
    romanOrRank: '9',
    image: 'cards/cups-09.jpg',
    uprightMeaning:
      'Duygusal tatmin, şükran, huzur ve dileklerin gerçekleşmesi ("Dilek Kartı"). Kendi emeklerinin ve sahip olduklarının keyfini çıkarma dönemini anlatır.',
    reversedMeaning:
      'Yüzeysel tatmin, dışsal başarıya rağmen içsel boşluk hissi veya aşırı rehavet.',
    symbolicDescription:
      'Mavi örtülü kavisli bir masa üzerine dizilmiş dokuz altın kupanın önünde, kollarını kavuşturmuş memnuniyetle gülümseyen bir figür oturur.',
    keywords: ['Doyum', 'Dileklerin Gerçekleşmesi', 'Memnuniyet', 'Şükran', 'Refah', 'Keyif'],
  },
  {
    id: 'cups-10',
    nameTr: 'Kupa Onlusu',
    nameEn: 'Ten of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 10,
    romanOrRank: '10',
    image: 'cards/cups-10.jpg',
    uprightMeaning:
      'Kalıcı huzur, aile ve sevdiklerle bütünlük, duygusal bolluk ve kalpten gelen mutluluk. İlişkilerde derin güvenin ve uyumun zirvesini temsil eder.',
    reversedMeaning:
      'Aile veya yakın çevrede geçici uyumsuzluk, beklentiler ile gerçeklik arasındaki fark ya da huzuru dış görünüşte arama.',
    symbolicDescription:
      'Gökyüzünde on altın kupadan oluşan gökkuşağının altında kollarını açmış bir çift, yanlarında neşeyle dans eden iki çocuk ve uzakta huzurlu bir ev görülür.',
    keywords: ['Mutluluk', 'Aile Uyumu', 'Huzur', 'Duygusal Bütünlük', 'Sevgi Dolu Yuva', 'Şükür'],
  },
  {
    id: 'cups-11',
    nameTr: 'Kupa Prensi',
    nameEn: 'Page of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 11,
    romanOrRank: 'Prens',
    image: 'cards/cups-11.jpg',
    uprightMeaning:
      'İçten bir duygusal mesaj, sanatsal ilham, sezgisel sürprizler ve naif bir duyarlılık. Kalbin sesini merak ve nezaketle dinlemeyi simgeler.',
    reversedMeaning:
      'Duygusal alınganlık, çocuksu kaprisler, yaratıcı tıkanıklık veya duyguları ifade etmekten çekinme.',
    symbolicDescription:
      'Deniz kıyısında çiçek desenli tunik giymiş genç, elindeki altın kupanın içinden başını çıkaran mavi balığa gülümseyerek bakar.',
    keywords: ['Duyarlılık', 'Sezgisel Mesaj', 'Sanatsal İlham', 'Naiflik', 'Merak', 'Şefkat'],
  },
  {
    id: 'cups-12',
    nameTr: 'Kupa Şövalyesi',
    nameEn: 'Knight of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 12,
    romanOrRank: 'Şövalye',
    image: 'cards/cups-12.jpg',
    uprightMeaning:
      'Romantik ve zarif yaklaşım, kalbin rehberliğinde hareket etme, barışçıl bir teklif ve sanatsal idealizm. Duyguları incelikle sunmayı temsil eder.',
    reversedMeaning:
      'Gerçeklerden kopuk hayalcilik, değişken ruh hali, tutulamayacak vaatler veya duygusal kararsızlık.',
    symbolicDescription:
      'Sakin adımlarla yürüyen beyaz bir at üzerinde, miğferi ve çizmeleri kanatlı, balık desenli pelerin giymiş şövalye elindeki kupayı ileri doğru uzatır.',
    keywords: ['Romantizm', 'Zafet', 'İdealizm', 'Kalpten Teklif', 'Şiirsellik', 'Nezaket'],
  },
  {
    id: 'cups-13',
    nameTr: 'Kupa Kraliçesi',
    nameEn: 'Queen of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 13,
    romanOrRank: 'Kraliçe',
    image: 'cards/cups-13.jpg',
    uprightMeaning:
      'Derin empati, sezgisel bilgelik, koşulsuz şefkat ve duygusal derinlik. Hem kendi duygularını hem de başkalarının kalbini yargılamadan anlayabilen şifacı enerjiyi simgeler.',
    reversedMeaning:
      'Başkalarının duygusal yükünü aşırı üstlenme, sınır koymakta zorlanma veya duygusal bunalmışlık.',
    symbolicDescription:
      'Deniz kıyısında deniz çocukları (cherub) ile süslü taş bir tahtta oturan Kraliçe, elindeki melek kulplu kapalı altın kupaya derin bir tefekkürle bakar.',
    keywords: ['Empati', 'Sezgi', 'Şefkat', 'Duygusal Derinlik', 'Şifacılık', 'İçsel Huzur'],
  },
  {
    id: 'cups-14',
    nameTr: 'Kupa Kralı',
    nameEn: 'King of Cups',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'cups',
    suitLabelTr: 'Kupalar',
    number: 14,
    romanOrRank: 'Kral',
    image: 'cards/cups-14.jpg',
    uprightMeaning:
      'Duygusal olgunluk, fırtınalı durumlarda bile korunan sükûnet, bilgece danışmanlık ve şefkatli liderlik. Kalp ile aklı dengede tutabilen güvenilir duruşu temsil eder.',
    reversedMeaning:
      'Duyguları aşırı bastırma, içsel dalgalanma, mesafeli duruş veya duygusal manipülasyon eğilimi.',
    symbolicDescription:
      'Dalgalı denizin ortasındaki taş tahtta sakinlikle oturan Kral; boynunda balık kolyesi, bir elinde kupa, diğerinde asa vardır; arkada zıplayan balık ve gemi görülür.',
    keywords: ['Duygusal Olgunluk', 'Sükûnet', 'Bilgelik', 'Şefkatli Otorite', 'Diplomasi', 'Denge'],
  },

  // ==========================================
  // KILIÇLAR (SWORDS: 1 - 14 / HAVA ELEMENTİ)
  // ==========================================
  {
    id: 'swords-01',
    nameTr: 'Kılıç Ası',
    nameEn: 'Ace of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 1,
    romanOrRank: 'As',
    image: 'cards/swords-01.jpg',
    uprightMeaning:
      'Zihinsel berraklık, gerçeğin ortaya çıkışı, keskin karar gücü ve yeni bir fikir. Kafa karışıklığını kesip atan dürüst ve net bir kavrayışı simgeler.',
    reversedMeaning:
      'Zihinsel bulanıklık, iletişimde kırıcı dil, kararsızlık veya gerçeği görmekte zorlanma.',
    symbolicDescription:
      'Buluttan çıkan el, ucunda defne ve palmiye dalları asılı altın bir taç bulunan çift ağızlı kılıcı dimdik tutar; altında sarp gri dağlar uzanır.',
    keywords: ['Berraklık', 'Hakikat', 'Keskin Zihin', 'Karar', 'Adalet', 'Yeni Fikir'],
  },
  {
    id: 'swords-02',
    nameTr: 'Kılıç İkilisi',
    nameEn: 'Two of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 2,
    romanOrRank: '2',
    image: 'cards/swords-02.jpg',
    uprightMeaning:
      'İki seçenek arasında kalma, karar vermeyi erteleme ve duyguları korumak için örülen zihinsel savunma. Gerçekle yüzleşmek için göz bağını çıkarma zamanı.',
    reversedMeaning:
      'Kararsızlık çıkmazının kırılması, gizlenen bir gerçeğin görülmesi veya bilgi kirliliği nedeniyle yaşanan stres.',
    symbolicDescription:
      'Durgun ve kayalık bir denizin önünde gözleri bağlı beyaz elbiseli bir kadın, göğsünün üzerinde çapraz tuttuğu iki büyük kılıcı dengeler; gökyüzünde hilal vardır.',
    keywords: ['İkilem', 'Ateşkes', 'Kararsızlık', 'Savunma', 'İçsel Denge Arayışı', 'Yüzleşme'],
  },
  {
    id: 'swords-03',
    nameTr: 'Kılıç Üçlüsü',
    nameEn: 'Three of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 3,
    romanOrRank: '3',
    image: 'cards/swords-03.jpg',
    uprightMeaning:
      'Kalp kırıklığı, üzüntü, acı veren ama özgürleştirici bir gerçekle yüzleşme. Duygusal acının bastırılmadan kabul edilmesiyle başlayacak zihinsel ve kalbi arınmayı anlatır.',
    reversedMeaning:
      'Kırgınlığın iyileşmeye başlaması, affediş, acıyı geride bırakma veya üzüntüyü içine atma.',
    symbolicDescription:
      'Gri yağmur bulutları ve sağanak yağış önünde, üç kılıç tarafından delinmiş kırmızı bir kalp sembolik olarak betimlenir.',
    keywords: ['Kırgınlık', 'Yüzleşme', 'Hüzün', 'Duygusal Boşalma', 'Gerçek', 'Şifa Başlangıcı'],
  },
  {
    id: 'swords-04',
    nameTr: 'Kılıç Dörtlüsü',
    nameEn: 'Four of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 4,
    romanOrRank: '4',
    image: 'cards/swords-04.jpg',
    uprightMeaning:
      'Zihinsel dinlenme, mola verme, sessizlik içinde güç toplama ve meditasyon. Yoğun bir mücadelenin ardından zihni ve bedeni yenilemek için geri çekilme gerekliliği.',
    reversedMeaning:
      'Dinlenme sürecinin tamamlanıp yeniden harekete geçilmesi veya dinlenmeyi reddederek yaşanan zihinsel tükenmişlik.',
    symbolicDescription:
      'Bir kilise lahdi üzerinde ellerini dua pozisyonunda birleştirmiş uzanan şövalye heykeli; duvarda üç kılıç, lahitin yanında bir kılıç ve vitrayda PAX (Barış) yazısı görülür.',
    keywords: ['Dinlenme', 'Zihinsel Mola', 'Sükûnet', 'Toparlanma', 'Meditasyon', 'İyileşme'],
  },
  {
    id: 'swords-05',
    nameTr: 'Kılıç Beşlisi',
    nameEn: 'Five of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 5,
    romanOrRank: '5',
    image: 'cards/swords-05.jpg',
    uprightMeaning:
      'Kazanılsa bile burukluk bırakan tartışmalar, ego çatışması ve haklı çıkma hırsının ilişkilere verdiği zarar. Hangi mücadelenin gerçekten değip değmeyeceğini sorgulatır.',
    reversedMeaning:
      'Tartışmayı sonlandırma, uzlaşma isteği, kırgınlıkları onarma veya anlamsız bir çekişmeden çekilme.',
    symbolicDescription:
      'Parçalı bulutlu gökyüzü altında üç kılıcı toplayan figür, yerdeki iki kılıcın yanından uzaklaşan iki üzgün kişiye doğru bakar.',
    keywords: ['Ego Çatışması', 'Buruk Zafer', 'Gerginlik', 'Uzlaşma İhtiyacı', 'Sınırlar', 'Ders'],
  },
  {
    id: 'swords-06',
    nameTr: 'Kılıç Altılısı',
    nameEn: 'Six of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 6,
    romanOrRank: '6',
    image: 'cards/swords-06.jpg',
    uprightMeaning:
      'Çalkantılı bir dönemden daha sakin sulara geçiş, zihinsel rahatlama ve iyileştirici bir yolculuk. Geçmişin ağırlığını taşırken bile huzurlu bir kıyıya doğru ilerlemeyi simgeler.',
    reversedMeaning:
      'Geçmiş sorunlardan kopmakta zorlanma, geçiş sürecinde yaşanan gecikme veya yüzleşilmesi gereken konular.',
    symbolicDescription:
      'Bir kayıkçı, pelerinli bir kadın ve çocuğu, burnuna altı kılıç saplanmış kayıkla dalgalı sudan karşıdaki durgun ve sakin kıyıya doğru götürür.',
    keywords: ['Geçiş', 'Sakin Sular', 'Zihinsel İyileşme', 'Uzaklaşma', 'Yolculuk', 'Kabul'],
  },
  {
    id: 'swords-07',
    nameTr: 'Kılıç Yedilisi',
    nameEn: 'Seven of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 7,
    romanOrRank: '7',
    image: 'cards/swords-07.jpg',
    uprightMeaning:
      'Stratejik ve alışılmışın dışında hareket etme, diplomasi, gizlilik veya yüzleşmeden kaçınma. Hem kendi dürüstlüğümüzü hem de çevredeki niyetleri dikkatle tartma uyarısı.',
    reversedMeaning:
      'Gizli bir durumun açığa çıkması, dürüst bir konuşma yapma, kendini kandırmayı bırakma veya stratejiyi değiştirme.',
    symbolicDescription:
      'Renkli çadırların bulunduğu bir kamptan beş kılıcı kucaklayıp parmak uçlarında sessizce uzaklaşan, geride toprağa saplı iki kılıç bırakan bir figür görülür.',
    keywords: ['Strateji', 'Temkin', 'Gizlilik', 'Kurnazlık', 'Kaçınma', 'Öz Dürüstlük'],
  },
  {
    id: 'swords-08',
    nameTr: 'Kılıç Sekizlisi',
    nameEn: 'Eight of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 8,
    romanOrRank: '8',
    image: 'cards/swords-08.jpg',
    uprightMeaning:
      'Zihinsel sıkışmışlık hissi, çaresizlik algısı ve kişinin kendi korkularıyla kendini sınırlaması. Engellerin çoğunun dışsal değil, düşünce kalıplarından kaynaklandığını gösterir.',
    reversedMeaning:
      'Kısıtlayıcı düşüncelerden sıyrılma, çıkış yolunu görme, özgüveni yeniden kazanma ve zihinsel özgürleşme.',
    symbolicDescription:
      'Gözleri ve kolları bağlı bir kadın, çevresine saplanmış sekiz kılıcın ortasında durur; ancak ayakları serbesttir ve önündeki yol açıktır.',
    keywords: ['Zihinsel Kısıtlama', 'Korku', 'Çaresizlik Algısı', 'Farkındalık', 'Çıkış Yolu', 'Özgürleşme'],
  },
  {
    id: 'swords-09',
    nameTr: 'Kılıç Dokuzlusu',
    nameEn: 'Nine of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 9,
    romanOrRank: '9',
    image: 'cards/swords-09.jpg',
    uprightMeaning:
      'Yoğun kaygı, uykusuzluk, zihinde büyütülen senaryolar ve vicdan muhasebesi. Gece karanlığında devleşen endişelerin gerçekte olduğundan çok daha ağır hissedildiğini hatırlatır.',
    reversedMeaning:
      'Kaygıların hafiflemesi, destek isteme, korkularla yüzleşip zihinsel huzura kavuşma başlangıcı.',
    symbolicDescription:
      'Karanlık bir odada yatağında doğrulup yüzünü elleriyle kapatan figür; arkasındaki siyah duvarda yatay olarak dizilmiş dokuz kılıç ve yorgan üzerinde gül ile burç motifleri vardır.',
    keywords: ['Kaygı', 'Aşırı Düşünme', 'Evham', 'Yüzleşme', 'Şefkat İhtiyacı', 'Zihni Sakinleştirme'],
  },
  {
    id: 'swords-10',
    nameTr: 'Kılıç Onlusu',
    nameEn: 'Ten of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 10,
    romanOrRank: '10',
    image: 'cards/swords-10.jpg',
    uprightMeaning:
      'Zorlu bir zihinsel sürecin kesin olarak sona ermesi, dip noktasının görülmesi ve artık daha kötüsünün geride kalması. Karanlığın bittiği yerde ufukta doğan yeni şafağı müjdeler.',
    reversedMeaning:
      'Toparlanma, ağır bir krizin ardından yeniden ayağa kalkma, yaraları sarma ve yenilenme.',
    symbolicDescription:
      'Karanlık gökyüzü altında yerde uzanan figür ve on kılıç; ancak hemen karşı ufukta altın sarısı güneş doğmakta ve deniz durgunlaşmaktadır.',
    keywords: ['Kesin Kapanış', 'Şafak Vakti', 'Bırakış', 'Toparlanma Öncesi', 'Geride Bırakma', 'Yeni Gün'],
  },
  {
    id: 'swords-11',
    nameTr: 'Kılıç Prensi',
    nameEn: 'Page of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 11,
    romanOrRank: 'Prens',
    image: 'cards/swords-11.jpg',
    uprightMeaning:
      'Zihinsel çeviklik, meraklı sorgulama, dürüst iletişim ve yeni bilgileri hızla öğrenme isteği. Olayları dikkatle gözlemleyen uyanık bir zihni temsil eder.',
    reversedMeaning:
      'Sözleri tartmadan konuşma, dedikodu, zihinsel dağınıklık veya her şeyden şüphe duyma.',
    symbolicDescription:
      'Rüzgârlı bir tepede saçları savrulan genç, iki eliyle kılıcını havada tutarak dikkatle arkasına bakar; gökyüzünde bulutlar ve kuşlar süzülür.',
    keywords: ['Zihinsel Çeviklik', 'Merak', 'Gözlem', 'Dürüst İletişim', 'Sorgulama', 'Haber'],
  },
  {
    id: 'swords-12',
    nameTr: 'Kılıç Şövalyesi',
    nameEn: 'Knight of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 12,
    romanOrRank: 'Şövalye',
    image: 'cards/swords-12.jpg',
    uprightMeaning:
      'Hızlı düşünme, hedefe doğrudan odaklanma, entelektüel cesaret ve net eylem. İnandığı fikri kararlılıkla savunan güçlü bir iradeyi simgeler.',
    reversedMeaning:
      'Acelecilik, kırıcı dobra konuşmalar, sabırsızlık veya düşünmeden atılan adımlar.',
    symbolicDescription:
      'Rüzgâra karşı dörtnala koşan beyaz at üzerinde, kılıcını ileri uzatmış zırhlı şövalye; atın koşumlarında kelebek ve kuş motifleri yer alır.',
    keywords: ['Kararlı Hamle', 'Hızlı Zihin', 'Cesaret', 'Doğrudanlık', 'Netlik', 'Odak'],
  },
  {
    id: 'swords-13',
    nameTr: 'Kılıç Kraliçesi',
    nameEn: 'Queen of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 13,
    romanOrRank: 'Kraliçe',
    image: 'cards/swords-13.jpg',
    uprightMeaning:
      'Bağımsız zihin, berrak muhakeme, sağlıklı sınırlar ve deneyimler sonucunda kazanılmış bilgelik. Duygusal karmaşanın ötesini gören dürüst ve adil bir yaklaşımı anlatır.',
    reversedMeaning:
      'Aşırı mesafelilik, sert eleştirellik, kırgınlık nedeniyle örülen duvarlar veya soğuk iletişim.',
    symbolicDescription:
      'Bulutların üzerindeki kelebek motifli taş tahtta oturan Kraliçe, sağ elinde kılıcı dik tutarken sol elini açık bir davet ve dürüstlükle ileri uzatır.',
    keywords: ['Berrak Zihin', 'Bağımsızlık', 'Dürüstlük', 'Sağlıklı Sınırlar', 'Bilgelik', 'Seçicilik'],
  },
  {
    id: 'swords-14',
    nameTr: 'Kılıç Kralı',
    nameEn: 'King of Swords',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'swords',
    suitLabelTr: 'Kılıçlar',
    number: 14,
    romanOrRank: 'Kral',
    image: 'cards/swords-14.jpg',
    uprightMeaning:
      'Entelektüel otorite, nesnel analiz, etik ilkeler, stratejik akıl ve hakkaniyetli liderlik. Duygulara kapılmadan gerçeği ve adaleti gözeten olgun zihni temsil eder.',
    reversedMeaning:
      'Katı kuralcılık, empati eksikliği, gücü baskı için kullanma veya kararsızlık.',
    symbolicDescription:
      'Kelebek ve hilal motifli yüksek tahtta tam karşıya bakarak oturan Kral, sağ elinde çift ağızlı kılıcını hafif eğik ama kararlı biçimde tutar.',
    keywords: ['Analitik Zekâ', 'Hakkaniyet', 'Stratejik Liderlik', 'Etik', 'Nesnellik', 'Otorite'],
  },

  // ==========================================
  // TILSIMLAR (PENTACLES: 1 - 14 / TOPRAK ELEMENTİ)
  // ==========================================
  {
    id: 'pentacles-01',
    nameTr: 'Tılsım Ası',
    nameEn: 'Ace of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 1,
    romanOrRank: 'As',
    image: 'cards/pentacles-01.jpg',
    uprightMeaning:
      'Somut bir fırsat, maddi ve dünyevi bereket, güvenli bir başlangıç ve uzun vadeli istikrar tohumu. Emek verildiğinde kalıcı refaha dönüşecek yeni bir adımı simgeler.',
    reversedMeaning:
      'Kaçırılan veya geciken fırsatlar, plansız harcamalar, güvensizlik hissi ya da kısa vadeli düşünme.',
    symbolicDescription:
      'Buluttan uzanan el, üzerinde beş köşeli yıldız bulunan altın tılsımı tutar; aşağıda beyaz zambaklarla dolu yemyeşil bir bahçe ve dağlara açılan kemerli çiçek kapısı vardır.',
    keywords: ['Somut Fırsat', 'Bereket', 'İstikrar', 'Refah', 'Sağlam Temel', 'Filizlenme'],
  },
  {
    id: 'pentacles-02',
    nameTr: 'Tılsım İkilisi',
    nameEn: 'Two of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 2,
    romanOrRank: '2',
    image: 'cards/pentacles-02.jpg',
    uprightMeaning:
      'Birden fazla sorumluluğu esneklikle yürütme, zaman ve kaynak yönetimi, değişen koşullara uyum sağlama. Hayatın dalgaları arasında ritmi koruyarak denge bulmayı anlatır.',
    reversedMeaning:
      'Aynı anda çok fazla yükün altında dağılma, öncelikleri şaşırma veya bütçe/zaman dengesinin bozulması.',
    symbolicDescription:
      'Dalgalı denizde inip çıkan iki geminin önünde, sonsuzluk işareti (lemniskat) biçiminde bir kuşakla çevrili iki tılsımı dans eder gibi çeviren genç bir figür görülür.',
    keywords: ['Denge', 'Esneklik', 'Zaman Yönetimi', 'Uyum', 'Çoklu Görev', 'Ritim'],
  },
  {
    id: 'pentacles-03',
    nameTr: 'Tılsım Üçlüsü',
    nameEn: 'Three of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 3,
    romanOrRank: '3',
    image: 'cards/pentacles-03.jpg',
    uprightMeaning:
      'Ustalık, ekip çalışması, ortak bir hedef için farklı uzmanlıkların birleşmesi ve nitelikli emek. Özenle yapılan işin takdir gördüğü verimli bir süreci simgeler.',
    reversedMeaning:
      'Ekip içi uyumsuzluk, detaylara özen göstermeme, motivasyon düşüklüğü veya tek başına çalışmakta ısrar etme.',
    symbolicDescription:
      'Bir katedral kemerinde üç tılsım motifini işleyen taş ustası, elinde mimari plan tutan keşiş ve mimarla birlikte eseri değerlendirir.',
    keywords: ['İşbirliği', 'Ustalık', 'Kaliteli Emek', 'Ekip Ruhu', 'Öğrenme', 'İnşa'],
  },
  {
    id: 'pentacles-04',
    nameTr: 'Tılsım Dörtlüsü',
    nameEn: 'Four of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 4,
    romanOrRank: '4',
    image: 'cards/pentacles-04.jpg',
    uprightMeaning:
      'Sahip olunanları koruma, birikim yapma, maddi güvenlik arayışı ve sınırları sıkı tutma. Tutumluluk ile kaybetme korkusuyla aşırı tutunma arasındaki dengeyi hatırlatır.',
    reversedMeaning:
      'Kontrolü biraz gevşetme, paylaşmaya açılma veya tam tersi olarak gereksiz maddi kaygılar.',
    symbolicDescription:
      'Şehrin önünde oturan figür; bir tılsımı göğsüne bastırır, birini başının üzerinde, ikisini de ayaklarının altında sıkıca tutar.',
    keywords: ['Koruma', 'Güvenlik', 'Tutunma', 'Birikim', 'Kontrol', 'İstikrar Arayışı'],
  },
  {
    id: 'pentacles-05',
    nameTr: 'Tılsım Beşlisi',
    nameEn: 'Five of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 5,
    romanOrRank: '5',
    image: 'cards/pentacles-05.jpg',
    uprightMeaning:
      'Geçici yoksunluk hissi, zorlu koşullar veya dışlanmışlık duygusu. Ancak hemen yandaki aydınlık vitraylı pencerenin gösterdiği gibi yardımın ve sıcaklığın çok yakında olduğunu hatırlatır.',
    reversedMeaning:
      'Zorlu bir dönemin geride kalması, maddi veya manevi toparlanma, destek kabul etme ve umudun yeşermesi.',
    symbolicDescription:
      'Kar yağışı altında yürüyen iki yorgun figür, arkasında beş altın tılsımlı sıcak bir vitray pencerenin parladığı duvarın önünden geçer.',
    keywords: ['Dayanışma İhtiyacı', 'Geçici Zorluk', 'Yardımı Görme', 'Direnç', 'Toparlanma', 'Şefkat'],
  },
  {
    id: 'pentacles-06',
    nameTr: 'Tılsım Altılısı',
    nameEn: 'Six of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 6,
    romanOrRank: '6',
    image: 'cards/pentacles-06.jpg',
    uprightMeaning:
      'Cömertlik, alma ve verme dengesi, yardımlaşma ve kaynakların adil paylaşımı. Hem destek sunmanın hem de gerektiğinde desteği zarafetle kabul etmenin önemini anlatır.',
    reversedMeaning:
      'Tek taraflı fedakârlık, çıkar amaçlı yardımlar veya alma-verme dengesinde bozulma.',
    symbolicDescription:
      'Bir elinde adalet terazisi tutan varlıklı bir tüccar, diğer eliyle önünde diz çökmüş iki kişiye altın paralar verir; yukarıda altı tılsım dizilidir.',
    keywords: ['Cömertlik', 'Alma-Verme Dengesi', 'Paylaşım', 'Destek', 'Adalet', 'Bereket Akışı'],
  },
  {
    id: 'pentacles-07',
    nameTr: 'Tılsım Yedilisi',
    nameEn: 'Seven of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 7,
    romanOrRank: '7',
    image: 'cards/pentacles-07.jpg',
    uprightMeaning:
      'Sabır, uzun vadeli yatırım, verilen emeğin olgunlaşmasını beklerken yapılan ara değerlendirme. Tohumların büyüdüğünü ve hasat için biraz daha zamana ihtiyaç olduğunu gösterir.',
    reversedMeaning:
      'Sabırsızlık, emeğin karşılığını hemen görememekten doğan hayal kırıklığı veya stratejiyi gözden geçirme ihtiyacı.',
    symbolicDescription:
      'Çenesini çapasına dayamış bir bahçıvan, üzerinde altı tılsım büyüyen gür çalıya ve ayaklarının dibindeki yedinci tılsıma düşünceli biçimde bakar.',
    keywords: ['Sabır', 'Uzun Vadeli Emek', 'Değerlendirme', 'Olgunlaşma', 'Hasat Bekleyişi', 'Özen'],
  },
  {
    id: 'pentacles-08',
    nameTr: 'Tılsım Sekizlisi',
    nameEn: 'Eight of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 8,
    romanOrRank: '8',
    image: 'cards/pentacles-08.jpg',
    uprightMeaning:
      'Özverili çalışma, zanaatkârlık, yeni bir beceriyi sabırla geliştirme ve detaylara gösterilen titizlik. Adım adım ustalaşma sürecinin getirdiği gururu temsil eder.',
    reversedMeaning:
      'Aşırı mükemmeliyetçilik, monotonluk hissi veya motivasyon kaybı nedeniyle işin özensizleşmesi.',
    symbolicDescription:
      'Tezgâhında çekiç ve keskiyle bir tılsımı özenle işleyen zanaatkâr; yanındaki ahşap direkte tamamladığı altı tılsım asılıdır, biri de yerde durur.',
    keywords: ['Ustalık Yolculuğu', 'Titizlik', 'Çalışkanlık', 'Beceri Geliştirme', 'Odak', 'Zanaat'],
  },
  {
    id: 'pentacles-09',
    nameTr: 'Tılsım Dokuzlusu',
    nameEn: 'Nine of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 9,
    romanOrRank: '9',
    image: 'cards/pentacles-09.jpg',
    uprightMeaning:
      'Kendi ayakları üzerinde durmanın getirdiği bolluk, zarafet, özdeğer ve bağımsızlık. Kendi emeğiyle kurulan huzurlu ve bereketli yaşam alanının tadını çıkarmayı anlatır.',
    reversedMeaning:
      'Başarıya rağmen dinlenememe, maddi bağımlılık kaygısı veya içsel huzuru yalnızca dışsal statüye bağlama.',
    symbolicDescription:
      'Üzüm salkımları ve dokuz altın tılsımla çevrili bakımlı bir bağda, sırmalı kaftan giymiş zarif bir kadın sol elindeki eldivende başlıklı bir şahin taşır.',
    keywords: ['Bağımsızlık', 'Zarafet', 'Özdeğer', 'Bolluk', 'Huzurlu Yaşam', 'Emek Meyvesi'],
  },
  {
    id: 'pentacles-10',
    nameTr: 'Tılsım Onlusu',
    nameEn: 'Ten of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 10,
    romanOrRank: '10',
    image: 'cards/pentacles-10.jpg',
    uprightMeaning:
      'Kalıcı bolluk, kuşaklar arası güven, köklü aile mirası ve uzun vadeli refah. Yalnızca bugünü değil, geleceği de güvence altına alan sağlam bir yapıyı simgeler.',
    reversedMeaning:
      'Aile içi maddi görüş ayrılıkları, kısa vadeli çözümler veya geleneksel kalıplarla bireysel hedefler arasındaki gerilim.',
    symbolicDescription:
      'Kemerli bir avluda iki beyaz köpeğini okşayan bilge yaşlı adam, arkada konuşan genç çift ve küçük çocuk; sahne üzerinde Hayat Ağacı diziliminde on tılsım parlar.',
    keywords: ['Kalıcı Refah', 'Köklü Güven', 'Miras', 'Aile Bağı', 'İstikrar', 'Bolluk'],
  },
  {
    id: 'pentacles-11',
    nameTr: 'Tılsım Prensi',
    nameEn: 'Page of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 11,
    romanOrRank: 'Prens',
    image: 'cards/pentacles-11.jpg',
    uprightMeaning:
      'Öğrenme azmi, somut bir hedef için atılan dikkatli ilk adım, burs, eğitim veya yeni bir iş fırsatı. Fikirleri ayakları yere basan bir plana dönüştürme isteğini anlatır.',
    reversedMeaning:
      'Erteleme, odaklanma güçlüğü, pratik adımları ihmal etme veya kısa sürede sonuç bekleme.',
    symbolicDescription:
      'Yeni sürülmüş tarlalar ve çiçekli çayırda duran genç, iki avucunun arasında yükselttiği altın tılsımı büyük bir dikkat ve saygıyla inceler.',
    keywords: ['Öğrenme Azmi', 'Pratik Başlangıç', 'Odaklanma', 'Somut Hedef', 'Özen', 'Potansiyel'],
  },
  {
    id: 'pentacles-12',
    nameTr: 'Tılsım Şövalyesi',
    nameEn: 'Knight of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 12,
    romanOrRank: 'Şövalye',
    image: 'cards/pentacles-12.jpg',
    uprightMeaning:
      'Sabırlı ilerleyiş, güvenilirlik, sadakat ve başladığı işi sonuna kadar titizlikle götürme. Hızdan ziyade sağlamlığı ve istikrarı seçen kararlı emeği temsil eder.',
    reversedMeaning:
      'Aşırı durağanlık, rutine sıkışma, değişime direnç veya inatçılık.',
    symbolicDescription:
      'Sürülmüş bereketli tarlaların önünde, dört ayağı da yere sağlam basan güçlü siyah bir savaş atı üzerinde şövalye elinde tılsımı tutarak ufka bakar; miğferinde meşe yaprağı vardır.',
    keywords: ['Güvenilirlik', 'Sabır', 'İstikrar', 'Sadakat', 'Metodik Çalışma', 'Sağlam Adım'],
  },
  {
    id: 'pentacles-13',
    nameTr: 'Tılsım Kraliçesi',
    nameEn: 'Queen of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 13,
    romanOrRank: 'Kraliçe',
    image: 'cards/pentacles-13.jpg',
    uprightMeaning:
      'Topraklanmış şefkat, bolluk bilinci, hem pratik yaşamı hem de sevdiklerini özenle besleyen cömertlik. Güven veren, üretken ve huzurlu bir yaşam düzenini simgeler.',
    reversedMeaning:
      'Herkese yetişmeye çalışırken kendini ihmal etme, maddi kaygılar veya iş-yaşam dengesinin sarsılması.',
    symbolicDescription:
      'Kırmızı güllerle çevrili çardak altında, meyve ve keçi başı oymalı tahtta oturan Kraliçe kucağındaki tılsımı şefkatle tutar; sağ alt köşede bereketi simgeleyen bir tavşan görülür.',
    keywords: ['Cömertlik', 'Topraklanma', 'Bolluk', 'Şefkatli Özen', 'Pratik Bilgelik', 'Huzur'],
  },
  {
    id: 'pentacles-14',
    nameTr: 'Tılsım Kralı',
    nameEn: 'King of Pentacles',
    arcana: 'minor',
    arcanaLabelTr: 'Küçük Arkana',
    suit: 'pentacles',
    suitLabelTr: 'Tılsımlar',
    number: 14,
    romanOrRank: 'Kral',
    image: 'cards/pentacles-14.jpg',
    uprightMeaning:
      'Maddi ve dünyevi ustalık, cömert koruyuculuk, uzun vadeli güvence ve bilgece kaynak yönetimi. Sabır ve dürüst çalışmayla inşa edilmiş sarsılmaz başarıyı temsil eder.',
    reversedMeaning:
      'Maddiyata aşırı odaklanma, esneklikten uzaklaşma, inatçılık veya kaynak yönetiminde dengesizlik.',
    symbolicDescription:
      'Boğa başı oymalı tahtta, üzüm salkımlı kaftanı içinde oturan Kral; bir elinde asa, diğerinde altın tılsım tutar; zırhlı ayağı taş bir küreye basar, arkasında şato yükselir.',
    keywords: ['Bolluk Ustalığı', 'Güvence', 'Koruyucu Liderlik', 'İstikrar', 'Refah', 'Başarı'],
  },
];

export const TAROT_CARD_BY_ID: Record<string, TarotCard> = Object.fromEntries(
  TAROT_DECK.map((card) => [card.id, card])
);

export function getCardById(id: string): TarotCard | undefined {
  return TAROT_CARD_BY_ID[id];
}

export function resolveCardImageUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = relativePath.replace(/^\/+/, '');
  return `${normalizedBase}${cleanPath}`;
}
