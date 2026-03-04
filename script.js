// ========== 高级光团动效：自动不规则微动 + 物理惯性跟随 ==========
const cursorGlow = document.querySelector('.cursor-glow');

// 基础跟随参数
let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;
let speed = 0.09; // 惯性系数，越小越丝滑

// 自动漂移参数（鼠标不动时的不规则运动）
let driftTime = 0;
const driftAmp = 8; // 漂移幅度，越大动的越明显

// 监听鼠标移动，更新目标位置
document.addEventListener('mousemove', (e) => {
  // 光团居中跟随鼠标
  mouseX = e.clientX - cursorGlow.offsetWidth / 2;
  mouseY = e.clientY - cursorGlow.offsetHeight / 2;

  // 首页背景跟随鼠标（增强呼应）
  const streamLines = document.querySelector('.stream-lines');
  if (streamLines) {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    streamLines.style.transform = `translate(${x * 30}px, ${y * 30}px) scale(1.04)`;
    streamLines.style.transition = 'transform 0.8s ease';
  }
});

// 核心动画函数：物理惯性 + 自动漂移
function animateCursor() {
  if (!cursorGlow) return requestAnimationFrame(animateCursor);

  // 累加漂移时间，生成不规则运动
  driftTime += 0.03;
  const dx = Math.sin(driftTime * 0.7) * driftAmp; // 横向不规则漂移
  const dy = Math.cos(driftTime * 1.1) * driftAmp; // 纵向不规则漂移

  // 物理惯性计算
  posX += (mouseX - posX) * speed;
  posY += (mouseY - posY) * speed;

  // 应用位置 + 自动漂移
  cursorGlow.style.transform = `translate(${posX + dx}px, ${posY + dy}px)`;

  // 循环执行动画
  requestAnimationFrame(animateCursor);
}
// 启动光团动画
animateCursor();

// 导航栏滚动变色
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// 平滑滚动（避开导航栏）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      window.scrollTo({
        top: targetElement.offsetTop - navbarHeight,
        behavior: 'smooth'
      });
      // 移动端关闭汉堡菜单
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.querySelector('.hamburger');
      if (navLinks?.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fa fa-bars"></i>';
      }
    }
  });
});

// 移动端汉堡菜单
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') 
      ? '<i class="fa fa-times"></i>' 
      : '<i class="fa fa-bars"></i>';
  });
}

// 元素进入视口动效
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.section-title, .about-container, .portfolio-card-wrap, .contact-card');
  elements.forEach(element => {
    if (!element) return;
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (elementTop < windowHeight - 100) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};
// 初始化动效样式
document.querySelectorAll('.section-title, .about-container, .portfolio-card-wrap, .contact-card').forEach(el => {
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  }
});
// 监听滚动触发动效
window.addEventListener('scroll', animateOnScroll);
animateOnScroll();

// 作品弹窗（完整展示图片）
function openModal(img, title, desc) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  // 设置弹窗内容
  modalImg.src = img;
  modalImg.alt = title; // 优化图片alt属性
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  
  // 显示弹窗，禁止页面滚动
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // 图片加载完成后自适应（防止图片未加载完成时尺寸异常）
  modalImg.onload = function() {
    modalImg.style.opacity = '1';
  };
  modalImg.style.opacity = '0.8'; // 加载中半透明过渡
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
  document.body.style.overflow = ''; // 恢复页面滚动
}

// 按ESC键关闭弹窗（优化交互）
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// 防止点击弹窗内容区关闭弹窗（只点空白处关闭）
document.querySelector('.modal-content').addEventListener('click', function(e) {
  e.stopPropagation();
});