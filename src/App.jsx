import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { animate, stagger } from 'animejs'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Menu, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const imageUrl = (file) => `${import.meta.env.BASE_URL}images/${file}`

const projects = [
  {
    title: 'Иной масштаб',
    type: 'Корпоратив · 1 200 гостей',
    place: 'ЦВЗ Манеж, Москва',
    year: '2025',
    image: imageUrl('concert.jpg'),
    copy: 'Город внутри города: три сцены, гастрономический квартал и один общий финал.',
  },
  {
    title: 'Белая ночь',
    type: 'Свадьба · 180 гостей',
    place: 'Усадьба Архангельское',
    year: '2025',
    image: imageUrl('wedding.jpg'),
    copy: 'Камерная церемония, которая к полуночи превратилась в большой летний спектакль.',
  },
  {
    title: 'Точка сборки',
    type: 'Форум · 650 гостей',
    place: 'Дом культуры ГЭС-2',
    year: '2024',
    image: imageUrl('stage.jpg'),
    copy: 'Деловая программа без привычного ритма конференции: живая редакция, свет и движение.',
  },
  {
    title: 'После восьми',
    type: 'Гала-ужин · 240 гостей',
    place: 'Москва',
    year: '2024',
    image: imageUrl('ballroom.jpg'),
    copy: 'Классическая архитектура и современная режиссура ужина в пяти действиях.',
  },
]

const eventFormats = [
  { title: 'Корпоративы', detail: 'От встречи команды до шоу на большой сцене.', image: imageUrl('concert.jpg') },
  { title: 'Свадьбы', detail: 'Площадка, церемония и вечер по вашему сценарию.', image: imageUrl('wedding.jpg') },
  { title: 'Гала-ужины', detail: 'Гастрономия, свет и программа в едином ритме.', image: imageUrl('champagne.jpg') },
]

function EventFormats() {
  return (
    <section className="event-formats" id="formats" aria-label="Форматы событий">
      <div className="formats-scene">
        <div className="formats-reel">
          {eventFormats.map(({ title, detail, image }) => (
            <article className="format-panel" key={title}>
              <div className="format-image"><img src={image} alt="" loading="lazy" /></div>
              <div className="format-caption">
                <div className="format-title"><h2>{title}</h2></div>
                <p>{detail}</p>
              </div>
            </article>
          ))}
          <div className="formats-light" aria-hidden="true" />
        </div>
        <div className="formats-top">
          <span>Форматы событий</span>
          <a href="#projects">К проектам <ArrowDown size={15} aria-hidden="true" /></a>
        </div>
        <div className="formats-bottom">
          <div className="formats-progress" aria-hidden="true"><span /></div>
          <Link to="/contacts">Обсудить событие <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}

function usePageEntrance() {
  const location = useLocation()
  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, '') || '/'
    document.title = pathname === '/projects'
      ? 'Проекты — BNY Agency'
      : pathname === '/contacts'
        ? 'Контакты — BNY Agency'
        : 'BNY Agency — празднуй в удовольствие'

    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1))
      if (target) target.scrollIntoView({ behavior: 'instant' })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    if (location.pathname === '/' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = document.querySelectorAll('[data-enter]')
    animate(targets, {
      opacity: [0, 1],
      translateY: [32, 0],
      delay: stagger(70),
      duration: 900,
      ease: 'outExpo',
    })
  }, [location.pathname, location.hash])
}

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    if (!open) return undefined
    const close = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', close)
    document.body.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', close)
      document.body.classList.remove('menu-open')
    }
  }, [open])

  const links = [
    ['/projects', 'Проекты'],
    ['/#approach', 'Подход'],
    ['/#about', 'О бюро'],
    ['/contacts', 'Контакты'],
  ]

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="BNY Agency — на главную">
        <span>BNY</span>{' '}<strong>Agency</strong>
      </Link>
      <nav className="desktop-nav" aria-label="Основная навигация">
        {links.map(([to, label]) => to.startsWith('/#')
          ? <a href={import.meta.env.BASE_URL + to.slice(1)} key={to}>{label}</a>
          : <NavLink key={to} to={to}>{label}</NavLink>)}
      </nav>
      <Link className="header-cta" to="/contacts">Обсудить событие <ArrowUpRight size={16} /></Link>
      <button className="menu-toggle" type="button" onClick={() => setOpen(true)} aria-label="Открыть меню" aria-expanded={open}>
        <Menu size={25} />
      </button>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <button type="button" className="menu-close" onClick={() => setOpen(false)} aria-label="Закрыть меню"><X size={28} /></button>
        <div className="mobile-menu-brand">BNY Agency · Москва</div>
        <nav aria-label="Мобильная навигация">
          {links.map(([to, label]) => to.startsWith('/#')
            ? <a href={import.meta.env.BASE_URL + to.slice(1)} key={to} onClick={() => setOpen(false)}>{label}</a>
            : <Link key={to} to={to}>{label}</Link>)}
        </nav>
        <a className="mobile-email" href="mailto:hello@bureau17.ru">hello@bureau17.ru</a>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-word">BNY <em>Agency</em></div>
      <div className="footer-grid">
        <div><span>Москва</span><p>Делаем события<br />в России и за её пределами</p></div>
        <div><span>Связаться</span><a href="mailto:hello@bureau17.ru">hello@bureau17.ru</a><a href="tel:+74951201717">+7 495 120-17-17</a></div>
        <div><span>Социальные сети</span><a href="https://t.me/" target="_blank" rel="noreferrer">Telegram</a><a href="https://vk.com/" target="_blank" rel="noreferrer">ВКонтакте</a></div>
        <div className="footer-meta"><p>© 2026 BNY Agency</p><p>Демонстрационная версия</p><p>празднуй в удовольствие</p></div>
      </div>
    </footer>
  )
}

function ProjectSlider() {
  const [index, setIndex] = useState(0)
  const project = projects[index]
  const directionRef = useRef(1)

  const move = (step) => {
    directionRef.current = step
    setIndex((current) => (current + step + projects.length) % projects.length)
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    animate('.project-frame img', {
      opacity: [0.35, 1],
      scale: [1.06, 1],
      translateX: [directionRef.current * 24, 0],
      duration: 900,
      ease: 'outQuart',
    })
    animate('.project-copy > *', {
      opacity: [0, 1], translateY: [16, 0], delay: stagger(70), duration: 700, ease: 'outExpo',
    })
  }, [index])

  return (
    <section className="projects-showcase" id="projects" aria-label="Избранные проекты">
      <div className="section-topline">
        <p>Избранные проекты</p><Link to="/projects">Все проекты <ArrowUpRight size={16} /></Link>
      </div>
      <div className="project-stage">
        <div className="project-frame">
          <img key={project.image} src={project.image} alt="" />
          <div className="project-counter"><span>{String(index + 1).padStart(2, '0')}</span><i /><span>{String(projects.length).padStart(2, '0')}</span></div>
        </div>
        <div className="project-copy" aria-live="polite">
          <p className="project-type">{project.type}</p>
          <h2>{project.title}</h2>
          <p className="project-desc">{project.copy}</p>
          <div className="project-meta"><span>{project.place}</span><span>{project.year}</span></div>
          <div className="slider-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Предыдущий проект"><ArrowLeft /></button>
            <button type="button" onClick={() => move(1)} aria-label="Следующий проект"><ArrowRight /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Home() {
  const root = useRef(null)
  useLayoutEffect(() => {
    const scope = root.current
    const media = gsap.matchMedia(scope)
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true, prevent: (node) => node.classList?.contains('mobile-menu') })
      const tick = (time) => lenis.raf(time * 1000)
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)

      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.scene-photo', { scale: 1.17, duration: 1.65 }, 0)
        .from('.scene-line > span', { yPercent: 115, duration: 1.05, stagger: 0.13 }, 0.12)
        .from('.scene-meta, .scene-footer', { opacity: 0, duration: 0.7 }, 0.45)

      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.opening', start: 'top top', end: 'bottom bottom', scrub: 0.85 },
      })
        .fromTo('.scene-window', { clipPath: 'inset(0% 3% 3% 3%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65 }, 0)
        .to('.scene-image-depth', { scale: 1.12, yPercent: -3, duration: 1 }, 0)
        .to('.scene-title', { yPercent: -35, opacity: 0, duration: 0.55 }, 0.06)
        .to('.scene-shade', { opacity: 0.27, duration: 0.8 }, 0)
        .to('.scene-progress span', { scaleX: 1, duration: 1 }, 0)

      gsap.from('.manifesto h2', {
        clipPath: 'inset(0 0 100% 0)', y: 48, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: '.manifesto h2', start: 'top 83%', once: true },
      })
      const panels = gsap.utils.toArray('.format-panel', scope)
      const hiddenFrame = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
      const openFrame = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
      gsap.set(panels.slice(1), { autoAlpha: 0, clipPath: hiddenFrame })

      const formats = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.event-formats', start: 'top top', end: 'bottom bottom', scrub: 0.55 },
      })
      panels.forEach((panel, index) => {
        const start = index * 1.35
        formats.fromTo(panel.querySelector('.format-image'), { scale: 1.05 }, { scale: 1.15, duration: 1.65 }, start)
        if (index === 0) return

        const previous = panels[index - 1]
        formats
          .set(panel, { autoAlpha: 1 }, start)
          .to(previous.querySelector('.format-caption'), { autoAlpha: 0, y: -22, duration: 0.26 }, start)
          .to(panel, { clipPath: 'polygon(0% 0%, 28% 0%, 13% 100%, 0% 100%)', duration: 0.17 }, start)
          .to(panel, { clipPath: openFrame, duration: 0.46 }, start + 0.17)
          .fromTo('.formats-light', { xPercent: -112, opacity: 0.65 }, { xPercent: 116, opacity: 0, duration: 0.63 }, start)
          .from(panel.querySelector('h2'), { yPercent: 110, duration: 0.47, ease: 'power3.out' }, start + 0.24)
          .from(panel.querySelector('.format-caption p'), { opacity: 0, duration: 0.35 }, start + 0.4)
          .set(previous, { autoAlpha: 0 }, start + 0.63)
      })
      formats.to('.formats-progress span', { scaleX: 1, duration: formats.duration() }, 0)

      gsap.from('.project-stage', {
        clipPath: 'inset(9% 6% 9% 6%)', duration: 1.45, ease: 'power3.out',
        scrollTrigger: { trigger: '.project-stage', start: 'top 83%', once: true },
      })
      return () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    })
    return () => media.revert()
  }, [])

  return (
    <main className="home-page" ref={root}>
      <section className="opening">
        <div className="opening-scene">
          <div className="scene-window">
            <div className="scene-image-depth"><img className="scene-photo" src={imageUrl('scenography.webp')} alt="" fetchPriority="high" /></div>
            <div className="scene-shade" />
          </div>
          <div className="scene-meta"><span>Событийное бюро</span><span>Москва</span></div>
          <h1 className="scene-title" aria-label="празднуй в удовольствие">
            <span className="scene-line"><span>празднуй</span></span>{' '}
            <span className="scene-line"><span>в удовольствие</span></span>
          </h1>
          <div className="scene-footer">
            <p>Корпоративы, свадьбы и частные события</p>
            <a href="#manifesto">Смотреть дальше <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <div className="scene-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <section className="manifesto" id="manifesto">
        <p>Концепция и продакшн</p>
        <h2>Свет, пространство и люди. Всё работает на <em>одну идею.</em></h2>
      </section>

      <EventFormats />
      <ProjectSlider />

      <section className="approach" id="approach">
        <div className="approach-heading"><p>Наш подход</p><h2>Сначала —<br /><em>зачем.</em><br />Потом — всё<br />остальное.</h2></div>
        <div className="approach-list">
          <article><span>Исследование</span><p>Погружаемся в контекст компании, людей и момента. Находим смысл, который невозможно заменить декорацией.</p></article>
          <article><span>Концепция</span><p>Собираем одну сильную идею: визуальный язык, сценарий, пространство и эмоциональную траекторию гостя.</p></article>
          <article><span>Продакшн</span><p>Берём ответственность за каждый метр, минуту и человека — от площадки до финального технического прогона.</p></article>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-image"><img src={imageUrl('champagne.jpg')} alt="Башня из бокалов на вечернем приёме" /></div>
        <div className="about-copy">
          <p className="section-label">Бюро в цифрах</p>
          <h2>13 лет делаем<br />сложное <em>точным.</em></h2>
          <div className="stats">
            <div><strong>240+</strong><span>событий<br />реализовано</span></div>
            <div><strong>37</strong><span>городов<br />в географии бюро</span></div>
            <div><strong>82%</strong><span>клиентов<br />возвращаются</span></div>
          </div>
          <p className="about-text">Небольшая команда стратегов, продюсеров, режиссёров и дизайнеров. Для каждого проекта мы собираем точный состав — без лишних уровней и случайных людей.</p>
        </div>
      </section>

      <section className="quote">
        <p>«В какой-то момент мы перестали видеть продакшн и просто оказались внутри невероятного вечера. Наверное, это и есть высший класс».</p>
        <span>Директор по корпоративной культуре<br />технологической компании</span>
      </section>

      <section className="final-cta">
        <p>Есть повод?</p>
        <h2>Давайте сделаем<br /><em>событие.</em></h2>
        <Link to="/contacts">Начать разговор <ArrowUpRight /></Link>
      </section>
    </main>
  )
}

function Projects() {
  const [filter, setFilter] = useState('Все')
  const filters = ['Все', 'Корпоративные', 'Частные', 'Деловые']
  const category = (type) => type.includes('Свадьба') || type.includes('Гала') ? 'Частные' : type.includes('Форум') ? 'Деловые' : 'Корпоративные'
  const visible = filter === 'Все' ? projects : projects.filter((project) => category(project.type) === filter)
  return (
    <main className="projects-page">
      <section className="page-hero">
        <p data-enter>Портфолио · 2022–2026</p>
        <h1 data-enter>События, у которых<br />есть <em>свой голос.</em></h1>
        <div className="filter-bar" data-enter role="group" aria-label="Фильтр проектов">
          {filters.map((item) => <button type="button" key={item} className={item === filter ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
      </section>
      <section className="portfolio-grid" aria-live="polite">
        {visible.map((project, index) => (
          <article className={`portfolio-card card-${index % 4}`} key={project.title}>
            <div className="portfolio-image"><img src={project.image} alt="" /></div>
            <div className="portfolio-card-copy"><div><span>{project.type}</span><span>{project.year}</span></div><h2>{project.title}</h2><p>{project.copy}</p></div>
          </article>
        ))}
      </section>
      <section className="portfolio-note"><p>Некоторые проекты остаются конфиденциальными.</p><h2>Расскажем больше<br />на личной встрече.</h2><Link to="/contacts">Назначить встречу <ArrowUpRight /></Link></section>
    </main>
  )
}

function Contacts() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors = {}
    if (!data.get('name')?.trim()) nextErrors.name = 'Представьтесь, пожалуйста'
    if (!/^\S+@\S+\.\S+$/.test(data.get('email') || '')) nextErrors.email = 'Укажите корректную почту'
    if (!data.get('message')?.trim()) nextErrors.message = 'Коротко расскажите о событии'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setStatus('checked')
  }
  return (
    <main className="contacts-page">
      <section className="contact-intro">
        <p data-enter>Начнём с разговора</p>
        <h1 data-enter>Расскажите,<br />что вы хотите<br /><em>почувствовать.</em></h1>
        <div className="contact-direct" data-enter><span>Написать напрямую</span><a href="mailto:hello@bureau17.ru">hello@bureau17.ru</a><a href="tel:+74951201717">+7 495 120-17-17</a></div>
      </section>
      <section className="contact-form-wrap">
        {status === 'checked' ? (
          <div className="success-message" role="status"><Check size={32} /><p>Форма проверена.</p><span>В демонстрационной версии данные не отправляются.</span><button type="button" onClick={() => setStatus('idle')}>Вернуться к форме</button></div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row"><label htmlFor="name">Как к вам обращаться?</label><input id="name" name="name" type="text" autoComplete="name" placeholder="Имя" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</div>
            <div className="form-row"><label htmlFor="email">Куда ответить?</label><input id="email" name="email" type="email" autoComplete="email" placeholder="Почта" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div>
            <div className="form-row"><label htmlFor="company">Компания</label><input id="company" name="company" type="text" autoComplete="organization" placeholder="Название, если есть" /></div>
            <div className="form-row"><label htmlFor="message">О событии</label><textarea id="message" name="message" rows="4" placeholder="Формат, дата, количество гостей — или просто идея" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</div>
            <button className="submit-button" type="submit">Проверить форму <ArrowUpRight /></button>
            <p className="privacy">Демонстрационная версия. Данные не отправляются.</p>
          </form>
        )}
      </section>
    </main>
  )
}

function AppContent() {
  usePageEntrance()
  return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="/projects" element={<Projects />} /><Route path="/contacts" element={<Contacts />} /><Route path="*" element={<Home />} /></Routes><Footer /></>
}

export default function App() { return <AppContent /> }
