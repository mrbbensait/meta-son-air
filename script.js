/**
 * MetaPharma - Premium Kozmetik Üretim Sitesi
 * Ana JavaScript Dosyası
 */

// Tüm DOM içeriği yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', () => {
  // Elementleri seçelim
  const sections = document.querySelectorAll('section');
  const processSteps = document.querySelectorAll('.process-step');
  const processRows = document.querySelectorAll('.process-row');
  const processArrows = document.querySelectorAll('.arrow-down');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const fixedNav = document.querySelector('.fixed-nav');
  const backToTopBtn = document.querySelector('.back-to-top');
  const heroSection = document.querySelector('#hero');
  const formControls = document.querySelectorAll('.form-control');
  const images = document.querySelectorAll('img');
  const counters = document.querySelectorAll('.counter');
  const statsSection = document.querySelector('#stats-counter');
  let counterStarted = false;

  // Sayfa yükleme performansını takip etmek için
  if (window.performance && performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log('Sayfa yükleme süresi: ' + loadTime + 'ms');
      }, 0);
    });
  }

  // Büyük görselleri lazy-load etmek için
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      // Büyük görseller için lazy loading uygula
      if (img.src && (img.classList.contains('hero-background') || img.classList.contains('process-flow-img'))) {
        const src = img.src;
        img.src = ''; // Önce src'yi temizle
        img.dataset.src = src; // Veriyi data-src özniteliğine taşı
        imageObserver.observe(img); // Gözlemle
      }
    });
  }

  // Hero bölümü görselinin yüklenmesini takip et ve hata durumunda alternatif göster
  const heroBackground = document.querySelector('.hero-main-image');
  const heroPlaceholder = document.querySelector('.hero-placeholder');
  
  if (heroBackground) {
    // Görsel yüklendiğinde
    heroBackground.addEventListener('load', () => {
      console.log('Hero görseli başarıyla yüklendi');
      heroBackground.classList.add('loaded');
      
      // Placeholder'ı kaldırmak için delay ekle
      setTimeout(() => {
        if (heroPlaceholder) {
          heroPlaceholder.style.display = 'none';
        }
      }, 500);
    });
    
    // Hata durumunda alternatif görsel göster
    heroBackground.addEventListener('error', () => {
      console.log('Hero görseli yüklenemedi, alternatif görsel gösteriliyor');
      // Yerel görsel varsa onu kullan, yoksa gradient arka plan kalsın
      heroBackground.style.display = 'none';
      if (heroPlaceholder) {
        heroPlaceholder.style.opacity = '1';
      }
    });
    
    // Critical resource hint ekle
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1200&fm=webp';
    preloadLink.type = 'image/webp';
    document.head.appendChild(preloadLink);
  }

  // Sayaç animasyonu fonksiyonu
  function startCounters() {
    if (counterStarted) return;
    
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const speed = 200; // Animasyon hızı (düşük değer daha hızlı)
      const increment = target / speed;
      let count = 0;
      
      const updateCount = () => {
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target;
        }
      };
      
      updateCount();
    });
    
    counterStarted = true;
  }

  // Sayfa kaydırıldığında gerçekleşecek işlemler
  window.addEventListener('scroll', () => {
    // Yüksek performanslı kaydırma olayı için requestAnimationFrame kullan
    window.requestAnimationFrame(() => {
      // Sabit navigasyon görünürlüğü
      if (window.scrollY > 300) {
        fixedNav.classList.add('visible');
      } else {
        fixedNav.classList.remove('visible');
      }

      // Yukarı çık butonu görünürlüğü
      if (window.scrollY > 700) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      // Bölümlerin görünür hale gelme animasyonu
      checkSectionsVisibility();
      
      // Process Flow elemanlarının görünürlüğünü kontrol et
      checkProcessFlowVisibility();
      
      // Sayaçları kontrol et
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
          startCounters();
        }
      }
    });
  });

  // Yukarı çık butonuna tıklama işlemi
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobil menü düğmesine tıklama
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Bölümlerin görünürlüğünü kontrol et
  function checkSectionsVisibility() {
    sections.forEach(section => {
      // Performans için getBoundingClientRect'i bir kez çağır
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Bölüm ekranda görünür hale geldiğinde
      if (rect.top < windowHeight * 0.8) {
        if (!section.classList.contains('is-visible')) {
          section.classList.add('is-visible');
        }
      }
    });
  }

  // Process flow elemanlarının görünürlüğünü kontrol et
  function checkProcessFlowVisibility() {
    // Process row container'ları kontrol edelim
    const processRowContainers = document.querySelectorAll('.process-row-container');
    processRowContainers.forEach(container => {
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        const row = container.querySelector('.process-row');
        const arrow = container.querySelector('.arrow-down');
        if (row) row.classList.add('is-visible');
        if (arrow) arrow.classList.add('is-visible');
      }
    });
  }

  // Süreç adımları için açılır/kapanır (accordion) işlevi
  processSteps.forEach(step => {
    const stepTitle = step.querySelector('h3');
    const details = step.querySelector('.details');
    const icon = step.querySelector('.toggle-icon');

    stepTitle.addEventListener('click', () => {
      // Aktif sınıf varsa sil, yoksa ekle (toggle)
      const isActive = step.classList.contains('active');
      
      // Diğer açık adımları kapat
      processSteps.forEach(otherStep => {
        if (otherStep !== step && otherStep.classList.contains('active')) {
          otherStep.classList.remove('active');
          otherStep.querySelector('.toggle-icon').textContent = '+';
        }
      });

      // Tıklanan adımı aç/kapat
      step.classList.toggle('active');
      icon.textContent = isActive ? '+' : '-';
    });
  });

  // Sayfa içi linklere tıklandığında yumuşak kaydırma
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Mobil menü açıksa kapat
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileMenuBtn) {
          mobileMenuBtn.classList.remove('active');
        }
      }

      // Hedef elemente yumuşak kaydırma
      const targetId = this.getAttribute('href');
      
      // # karakterinden başka bir şey varsa işlem yap
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70, // Navigasyon barı için boşluk bırak
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // İletişim formu gönderim işlemi
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Form verilerini al
      const formData = new FormData(this);
      const formValues = Object.fromEntries(formData.entries());
      
      // Burada form gönderimi için AJAX isteği yapılabilir
      // Örnek olması için basit bir başarı mesajı gösteriyoruz
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      submitBtn.textContent = 'Gönderiliyor...';
      submitBtn.disabled = true;
      
      // Form gönderim simülasyonu (gerçek uygulamada bu kısım backend ile iletişim kurar)
      setTimeout(() => {
        const successMessage = document.createElement('div');
        successMessage.className = 'alert-success';
        successMessage.textContent = 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.';
        
        contactForm.reset();
        contactForm.insertAdjacentElement('beforebegin', successMessage);
        
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        // Başarı mesajını bir süre sonra kaldır
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }, 1500);
    });
  }

  // Sayfa yüklendiğinde görünür bölümleri kontrol et
  checkSectionsVisibility();
  
  // Sayfa yüklendiğinde ilk bölümü görünür yap (hero section)
  if (heroSection) {
    heroSection.classList.add('is-visible');
  }

  // Form elemanları için floating label efekti
  if (formControls.length > 0) {
    formControls.forEach(control => {
      // Placeholder değerini label içeriği olarak ayarla ve placeholder'ı temizle
      if (control.getAttribute('placeholder')) {
        const placeholder = control.getAttribute('placeholder');
        const label = document.createElement('label');
        label.textContent = placeholder;
        control.parentNode.appendChild(label);
        control.setAttribute('placeholder', ' ');
      }
      
      // Input doldurulmuşsa label'ı yukarıda tutmak için sınıf ekle
      if (control.value !== '') {
        control.classList.add('has-value');
      }
      
      // Input değeri değiştiğinde kontrolü yap
      control.addEventListener('input', () => {
        if (control.value !== '') {
          control.classList.add('has-value');
        } else {
          control.classList.remove('has-value');
        }
      });
    });
  }

  // Sayfanın tam yüklenmesini kontrol et
  window.addEventListener('load', () => {
    document.documentElement.classList.add('page-loaded');
    console.log('Sayfa tamamen yüklendi');
  });
  
  // Browser uyumluluk kontrolü
  checkBrowserCompatibility();
  
  function checkBrowserCompatibility() {
    // Tarayıcı uyumluluğu kontrolü
    const isIE = !!document.documentMode; // Internet Explorer
    const isEdgeHTML = !isIE && !!window.StyleMedia; // Edge (EdgeHTML motoru)
    
    // Eski tarayıcılar için uyarı
    if (isIE || isEdgeHTML) {
      console.warn('Eski bir tarayıcı kullanıyorsunuz. Bazı özellikler düzgün çalışmayabilir.');
      
      // Basit uyarı mesajı oluştur (isteğe bağlı)
      const warningDiv = document.createElement('div');
      warningDiv.style.padding = '10px';
      warningDiv.style.backgroundColor = '#ffe0e0';
      warningDiv.style.color = '#d8000c';
      warningDiv.style.textAlign = 'center';
      warningDiv.style.position = 'fixed';
      warningDiv.style.top = '0';
      warningDiv.style.left = '0';
      warningDiv.style.right = '0';
      warningDiv.style.zIndex = '9999';
      warningDiv.innerHTML = 'Tarayıcınız güncel değil. Lütfen daha iyi bir deneyim için güncel bir tarayıcı kullanın.';
      
      document.body.prepend(warningDiv);
    }
    
    // Intersection Observer desteği kontrolü
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver desteği yok. Bazı animasyonlar çalışmayabilir.');
      
      // Tüm bölümleri görünür yap
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('is-visible');
        section.style.opacity = 1;
        section.style.transform = 'translateY(0)';
      });
    }
  }

  // İlk yüklemede görünürlüğü kontrol et
  setTimeout(() => {
    checkSectionsVisibility();
    checkProcessFlowVisibility();
  }, 100);
}); 