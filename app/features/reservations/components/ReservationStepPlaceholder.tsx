import { ReservationProgress } from "./AvailabilityPage";

export function ReservationStepPlaceholder({ active }: { active: 1 | 2 | 3 | 4 }) {
  return (
    <section className="content reservation-main">
      <div className="container">
        <ReservationProgress active={active} />
        <div className="banner-form form-style-1" />
      </div>
    </section>
  );
}
