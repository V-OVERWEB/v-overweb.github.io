document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('matrixHeader');
    const progressBar = document.getElementById('progressBar');
    const burger = document.getElementById('burgerMenu');
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav__link');
    const logoLink = document.getElementById('logoLink');

    function scrollToSection(sectionId) {
        let targetId = '';
        switch(sectionId) {
            case 'home':
                targetId = 'block__first';
                break;
            case 'about':
                targetId = 'block__about';
                break;
            case 'services':
                targetId = 'block__second';
                break;
            case 'reviews':
                targetId = 'block__reviews';
                break;
            case 'contacts':
                targetId = 'block__contacts';
                break;
            default:
                return;
        }
        
        const target = document.querySelector(`.${targetId}`);
        if (target) {
            const offset = 70;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            if (burger && nav) {
                burger.classList.remove('active');
                nav.classList.remove('active');
            }
            
            updateActiveLink(sectionId);
        }
    }

    function updateActiveLink(sectionId) {
        navLinks.forEach(link => {
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function getCurrentSection() {
        const sections = [
            { id: 'home', element: document.querySelector('.block__first'), offset: 100 },
            { id: 'services', element: document.querySelector('.block__second'), offset: 100 },
            { id: 'reviews', element: document.querySelector('.block__reviews'), offset: 100 },
            { id: 'contacts', element: document.querySelector('.block__contacts'), offset: 100 }
        ];
        
        const scrollPos = window.scrollY + 150;
        
        for (let section of sections) {
            if (section.element) {
                const top = section.element.offsetTop;
                const bottom = top + section.element.offsetHeight;
                if (scrollPos >= top && scrollPos < bottom) {
                    return section.id;
                }
            }
        }
        return 'home';
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            if (section) {
                scrollToSection(section);
            }
        });
    });

    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('home');
        });
    }

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
        
        
        const currentSection = getCurrentSection();
        updateActiveLink(currentSection);
    });
    
    updateActiveLink('home');
});