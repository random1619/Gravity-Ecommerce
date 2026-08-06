'use client'

import { useState } from 'react'
import styles from './ProductReviews.module.css'
import { Star, BadgeCheck } from 'lucide-react'


interface Review {
  id: number
  author: string
  rating: number
  date: string
  title: string
  content: string
  verified: boolean
  helpful: number
}

interface ProductReviewsProps {
  productId: number
  reviews: Review[]
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState('recent')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100
      : 0
  }))

  return (
    <div className={styles.reviewsSection}>
      <div className={styles.header}>
        <h2>Customer Reviews</h2>
        <button
          className={styles.writeReviewBtn}
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Write a Review
        </button>
      </div>

      <div className={styles.summary}>
        <div className={styles.overallRating}>
          <div className={styles.ratingNumber}>{averageRating.toFixed(1)}</div>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={20}
                className={star <= Math.round(averageRating) ? styles.starFilled : styles.star}
                fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <div className={styles.totalReviews}>Based on {reviews.length} reviews</div>
        </div>

        <div className={styles.distribution}>
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className={styles.distributionRow}>
              <span className={styles.distributionLabel}>
                {stars} <Star size={12} className={styles.distribStar} fill="currentColor" />
              </span>
              <div className={styles.distributionBar}>
                <div
                  className={styles.distributionFill}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={styles.distributionCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {showReviewForm && (
        <div className={styles.reviewForm}>
          <h3>Write Your Review</h3>
          <div className={styles.formGroup}>
            <label>Your Rating *</label>
            <div className={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${star <= (hoverRating || rating) ? styles.active : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star size={24} fill={star <= (hoverRating || rating) ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Review Title *</label>
            <input type="text" placeholder="Summarize your experience" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Your Review *</label>
            <textarea
              placeholder="Share your thoughts about this product"
              rows={5}
              className={styles.textarea}
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowReviewForm(false)}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Submit Review
            </button>
          </div>
        </div>
      )}

      <div className={styles.reviewsHeader}>
        <h3>{reviews.length} Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      <div className={styles.reviewsList}>
        {reviews.map(review => (
          <div key={review.id} className={styles.review}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewAuthor}>
                <div className={styles.authorAvatar}>{review.author[0]}</div>
                <div>
                  <div className={styles.authorName}>
                    {review.author}
                    {review.verified && (
                      <span className={styles.verified}><BadgeCheck size={13} strokeWidth={2.5} style={{ marginRight: 4, verticalAlign: '-2px' }} />Verified Purchase</span>
                    )}
                  </div>
                  <div className={styles.reviewDate}>{review.date}</div>
                </div>
              </div>
              <div className={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= review.rating ? styles.starFilled : styles.star}
                    fill={star <= review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            <h4 className={styles.reviewTitle}>{review.title}</h4>
            <p className={styles.reviewContent}>{review.content}</p>
            <div className={styles.reviewFooter}>
              <button className={styles.helpfulBtn}>
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
