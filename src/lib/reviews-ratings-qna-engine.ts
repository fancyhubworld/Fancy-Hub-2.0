import prisma from "@/lib/prisma";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";

export type QnAStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CreateReviewParams {
  userId: string;
  productId: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  images?: string[];
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  starPercentages: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ProductQuestionRecord {
  id: string;
  productId: string;
  userId: string;
  question: string;
  status: QnAStatus;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  createdAt: string;
}

// In-Memory Q&A Store
const productQuestions: ProductQuestionRecord[] = [];

// -------------------------------------------------------------------------
// 1. CONTENT MODERATION & ABUSE FILTER
// -------------------------------------------------------------------------

export class ReviewContentFilter {
  private static BLOCKED_KEYWORDS = [
    "scam",
    "fake",
    "fraud",
    "cheat",
    "cheap replica",
    "competitor",
    "http://",
    "https://",
    "www.",
  ];

  /**
   * Checks for abusive text or links
   */
  static containsAbuse(text: string): { flagged: boolean; reason?: string } {
    const lower = text.toLowerCase();
    for (const kw of this.BLOCKED_KEYWORDS) {
      if (lower.includes(kw)) {
        return { flagged: true, reason: `Review contains flagged keyword or link: "${kw}"` };
      }
    }
    return { flagged: false };
  }
}

// -------------------------------------------------------------------------
// 2. REVIEWS & RATINGS SERVICE
// -------------------------------------------------------------------------

export class ReviewsAndRatingsService {
  /**
   * Validates if customer is a verified buyer from database order history
   */
  static async checkVerifiedPurchase(userId: string, productId: string): Promise<boolean> {
    const orderWithItem = await prisma.order.findFirst({
      where: {
        userId,
        orderItems: {
          some: { productId },
        },
      },
    });

    return !!orderWithItem;
  }

  /**
   * Submits a customer review with verified purchase check & abuse filtering
   */
  static async submitReview(params: CreateReviewParams): Promise<{
    success: boolean;
    reviewId?: string;
    isVerified: boolean;
    isApproved: boolean;
    error?: string;
  }> {
    const { userId, productId, rating, title, comment } = params;

    // 1. Validate rating range (1 to 5)
    if (rating < 1 || rating > 5) {
      return { success: false, isVerified: false, isApproved: false, error: "Rating must be between 1 and 5 stars" };
    }

    // 2. Prevent duplicate reviews by same customer on same product
    const existingReview = await prisma.review.findFirst({
      where: { userId, productId },
    });

    if (existingReview) {
      return {
        success: false,
        isVerified: existingReview.isVerifiedPurchase,
        isApproved: existingReview.isApproved,
        error: "You have already reviewed this product. You can update your existing review.",
      };
    }

    // 3. Server-authoritative Verified Purchase Check
    const isVerified = await this.checkVerifiedPurchase(userId, productId);

    // 4. Content Abuse Check
    const abuseCheck = ReviewContentFilter.containsAbuse(`${title || ""} ${comment}`);
    const isApproved = !abuseCheck.flagged; // Auto-approve if clean, flag for moderation if suspicious

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
        isVerifiedPurchase: isVerified,
        isApproved,
      },
    });

    // 5. Recalculate and update product aggregate rating
    await this.recalculateProductRating(productId);

    return {
      success: true,
      reviewId: review.id,
      isVerified,
      isApproved,
    };
  }

  /**
   * Recalculates average rating and distribution safely
   */
  static async recalculateProductRating(productId: string): Promise<RatingSummary> {
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution,
        starPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    let sum = 0;
    for (const r of reviews) {
      sum += r.rating;
      const star = r.rating as 1 | 2 | 3 | 4 | 5;
      if (distribution[star] !== undefined) {
        distribution[star]++;
      }
    }

    const averageRating = Math.round((sum / totalReviews) * 10) / 10;

    const starPercentages = {
      1: Math.round((distribution[1] / totalReviews) * 100),
      2: Math.round((distribution[2] / totalReviews) * 100),
      3: Math.round((distribution[3] / totalReviews) * 100),
      4: Math.round((distribution[4] / totalReviews) * 100),
      5: Math.round((distribution[5] / totalReviews) * 100),
    };

    // Update product entity in database
    await prisma.product.update({
      where: { id: productId },
      data: {
        ratings: averageRating,
        reviewCount: totalReviews,
      },
    }).catch(() => {});

    return {
      averageRating,
      totalReviews,
      distribution,
      starPercentages,
    };
  }

  /**
   * Adds artisan vendor response to a review
   */
  static async addVendorResponse(reviewId: string, vendorResponse: string) {
    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { vendorResponse },
    });

    return {
      success: true,
      reviewId: updated.id,
      vendorResponse: updated.vendorResponse,
    };
  }

  /**
   * Moderates review status (Admin action)
   */
  static async moderateReview(reviewId: string, isApproved: boolean) {
    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
    });

    // Recalculate ratings
    await this.recalculateProductRating(updated.productId);

    return {
      success: true,
      reviewId: updated.id,
      isApproved: updated.isApproved,
    };
  }

  // -------------------------------------------------------------------------
  // 3. PRODUCT Q&A SUB-ENGINE
  // -------------------------------------------------------------------------

  /**
   * Submits a customer question for a product
   */
  static async askQuestion(params: {
    productId: string;
    userId: string;
    question: string;
  }): Promise<ProductQuestionRecord> {
    const { productId, userId, question } = params;

    const qRecord: ProductQuestionRecord = {
      id: `QNA-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId,
      userId,
      question,
      status: "APPROVED", // Auto-approved unless flagged
      createdAt: new Date().toISOString(),
    };

    productQuestions.push(qRecord);
    return qRecord;
  }

  /**
   * Answers a customer question (Vendor or Admin)
   */
  static async answerQuestion(params: {
    questionId: string;
    answer: string;
    answeredBy: string;
  }): Promise<{ success: boolean; question?: ProductQuestionRecord; error?: string }> {
    const { questionId, answer, answeredBy } = params;
    const q = productQuestions.find((item) => item.id === questionId);

    if (!q) {
      return { success: false, error: "Question not found" };
    }

    q.answer = answer;
    q.answeredBy = answeredBy;
    q.answeredAt = new Date().toISOString();

    return {
      success: true,
      question: q,
    };
  }

  /**
   * Retrieves answered questions for a product
   */
  static getProductQuestions(productId: string): ProductQuestionRecord[] {
    return productQuestions.filter((q) => q.productId === productId && q.status === "APPROVED");
  }
}
