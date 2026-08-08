'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CircleHelp, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import styles from './page.module.css'

/** Kowalski spring presets — snappy press, gentle entrances. */
const spring = {
  press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
  gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
} as const
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SplitTextReveal from '@/components/motion/SplitTextReveal'
import ScrollReveal from '@/components/motion/ScrollReveal'

const INFO_CARDS = [
  {
    icon: Mail,
    title: 'Email Us',
    line: 'support@gravity.com',
    sub: 'We typically reply within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    line: '1-800-GRAVITY',
    sub: 'Mon-Fri, 9AM-6PM EST',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    line: '123 Fashion Avenue',
    sub: 'New York, NY 10001',
  },
  {
    icon: CircleHelp,
    title: 'FAQ',
    line: 'Quick answers to common questions',
    sub: null,
    link: { href: '/faq', label: 'Visit FAQ' },
  },
] as const

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring.gentle, delay: 0.15 + i * 0.08 },
  }),
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => setStatus('idle'), 3000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className={styles.contactPage}>
      <Breadcrumbs />

      <div className={styles.hero}>
        <h1><SplitTextReveal text="Get in Touch" /></h1>
        <ScrollReveal direction="up" delay={150}>
          <p>{"We'd love to hear from you. Send us a message and we'll respond as soon as possible."}</p>
        </ScrollReveal>
      </div>

      <div className={styles.content}>
        <motion.div
          className={styles.formSection}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.gentle, delay: 0.1 }}
        >
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select a subject</option>
                <option value="order">Order Inquiry</option>
                <option value="product">Product Question</option>
                <option value="return">Returns & Exchanges</option>
                <option value="shipping">Shipping Information</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className={styles.textarea}
                placeholder="How can we help you?"
                rows={6}
              />
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div
                  key="success"
                  className={styles.successMessage}
                  role="status"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={spring.gentle}
                >
                  <Check size={16} aria-hidden="true" />
                  {"Thank you for contacting us! We'll get back to you within 24 hours."}
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  key="error"
                  className={styles.errorMessage}
                  role="alert"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={spring.gentle}
                >
                  Something went wrong. Please try again.
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'loading'}
              whileTap={{ scale: 0.98 }}
              transition={spring.press}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <div className={styles.infoSection}>
          {INFO_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className={styles.infoCard}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
            >
              <div className={styles.iconWrapper} aria-hidden="true">
                <card.icon size={22} strokeWidth={1.9} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.line}</p>
              <p className={styles.subtitle}>
                {'link' in card && card.link ? (
                  <a href={card.link.href} className={styles.link}>
                    {card.link.label}
                    <span aria-hidden="true"> →</span>
                  </a>
                ) : (
                  card.sub
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
