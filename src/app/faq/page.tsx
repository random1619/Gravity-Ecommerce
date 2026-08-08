'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Mail, MessageCircle } from 'lucide-react'
import styles from './page.module.css'

/** Kowalski spring presets — snappy press, gentle expansion. */
const spring = {
  press: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
  gentle: { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 },
  expand: { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 },
} as const
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SplitTextReveal from '@/components/motion/SplitTextReveal'
import StaggerGrid from '@/components/motion/StaggerGrid'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: 'Orders & Shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight options are available at checkout. International orders typically arrive within 10-14 business days.'
  },
  {
    category: 'Orders & Shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Customs fees and import taxes may apply and are the responsibility of the customer.'
  },
  {
    category: 'Orders & Shipping',
    question: 'Can I track my order?',
    answer: 'Absolutely! Once your order ships, you will receive a tracking number via email. You can also track your order anytime in the "Orders" section of your account.'
  },
  {
    category: 'Returns & Exchanges',
    question: 'What is your return policy?',
    answer: 'We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Start a return through your account or contact our support team.'
  },
  {
    category: 'Returns & Exchanges',
    question: 'How do I exchange an item?',
    answer: 'To exchange an item for a different size or color, simply return the original item and place a new order. This ensures you get your preferred item as quickly as possible.'
  },
  {
    category: 'Returns & Exchanges',
    question: 'When will I receive my refund?',
    answer: 'Refunds are processed within 5-7 business days of receiving your returned item. The refund will appear in your original payment method within 5-10 business days after processing.'
  },
  {
    category: 'Products & Sizing',
    question: 'How do I find my size?',
    answer: 'Check our comprehensive size guide available on each product page. We provide detailed measurements for all items. If you are between sizes, we recommend sizing up for a more comfortable fit.'
  },
  {
    category: 'Products & Sizing',
    question: 'Are your products sustainable?',
    answer: 'Yes! We are committed to sustainability. Our products use eco-friendly materials like organic cotton, recycled polyester, and Tencel. We also practice ethical manufacturing and carbon-neutral shipping.'
  },
  {
    category: 'Products & Sizing',
    question: 'How should I care for my items?',
    answer: 'Care instructions are on each product label. Generally, we recommend washing in cold water, using mild detergent, and air drying when possible. Avoid bleach and high heat to extend product life.'
  },
  {
    category: 'Account & Payment',
    question: 'Do I need an account to shop?',
    answer: 'No, you can checkout as a guest. However, creating an account lets you track orders, save favorites, access exclusive deals, and enjoy faster checkout on future purchases.'
  },
  {
    category: 'Account & Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. We also offer interest-free installment plans through Klarna and Afterpay.'
  },
  {
    category: 'Account & Payment',
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use industry-standard SSL encryption and never store your full credit card details. All transactions are processed through secure, PCI-compliant payment gateways.'
  },
  {
    category: 'Promotions & Discounts',
    question: 'Do you offer student discounts?',
    answer: 'Yes! Students get 15% off with a valid student ID. Verify your status through our student discount program on the checkout page or in your account settings.'
  },
  {
    category: 'Promotions & Discounts',
    question: 'Can I use multiple promo codes?',
    answer: 'Only one promo code can be applied per order. If you have multiple codes, the system will automatically apply the one that gives you the best discount.'
  },
  {
    category: 'Promotions & Discounts',
    question: 'When do you have sales?',
    answer: 'We run seasonal sales (Spring, Summer, Fall, Winter), holiday promotions (Black Friday, Cyber Monday), and exclusive member sales. Sign up for our newsletter to get early access to all sales.'
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))]
  const filteredFAQs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={styles.faqPage}>
      <Breadcrumbs />

      <div className={styles.hero}>
        <h1><SplitTextReveal text="Frequently Asked Questions" /></h1>
        <p>Find answers to common questions about orders, shipping, returns, and more</p>
      </div>

      <div className={styles.content}>
        <div className={styles.categories} role="group" aria-label="FAQ categories">
          {categories.map(category => (
            <motion.button
              key={category}
              className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => {
                setSelectedCategory(category)
                setOpenIndex(null)
              }}
              aria-pressed={selectedCategory === category}
              whileTap={{ scale: 0.95 }}
              transition={spring.press}
            >
              {category === 'all' ? 'All Questions' : category}
            </motion.button>
          ))}
        </div>

        <StaggerGrid className={styles.faqList} batchSize={6}>
          {filteredFAQs.map((faq, index) => {
            const open = openIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-button-${index}`
            return (
              <div key={`${selectedCategory}-${index}`} className={styles.faqItem}>
                <button
                  id={buttonId}
                  className={`${styles.question} ${open ? styles.open : ''}`}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={open}
                  aria-controls={panelId}
                >
                  <span>{faq.question}</span>
                  <motion.span
                    className={styles.icon}
                    initial={false}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={spring.gentle}
                    aria-hidden="true"
                  >
                    <ChevronDown size={20} strokeWidth={2} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="answer"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={styles.answer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={spring.expand}
                    >
                      <div className={styles.answerInner}>
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </StaggerGrid>

        <div className={styles.contactSection}>
          <h2>Still have questions?</h2>
          <p>Our support team is here to help!</p>
          <div className={styles.contactButtons}>
            <motion.a
              href="/contact"
              className={styles.primaryBtn}
              whileTap={{ scale: 0.97 }}
              transition={spring.press}
            >
              <MessageCircle size={16} aria-hidden="true" />
              Contact Support
            </motion.a>
            <motion.a
              href="mailto:support@gravity.com"
              className={styles.secondaryBtn}
              whileTap={{ scale: 0.97 }}
              transition={spring.press}
            >
              <Mail size={16} aria-hidden="true" />
              Email Us
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  )
}
