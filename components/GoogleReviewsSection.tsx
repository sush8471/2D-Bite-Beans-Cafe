import VerticalMarqueeDemo from "@/components/ui/marquee-03";

export default function GoogleReviewsSection() {
  return (
    <section
      id="reviews"
      className="reviews-section"
      aria-label="Customer Reviews"
      style={{ backgroundColor: "var(--bg-secondary)", overflow: "hidden" }}
    >
      <div className="container">
        <VerticalMarqueeDemo />
      </div>
    </section>
  );
}
