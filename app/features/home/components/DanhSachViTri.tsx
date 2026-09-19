import CardDestination from "@/components/ui/CardDestination";

export default function DanhSachViTri() {
  return (
    <section className="rooms rooms-style2 rooms-style3 pad-bottom-70">
      <div className="container">
        <div className="section-title">
          <h2>
            Explore <span>Destination</span>
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex
            neque, sodales accumsan sapien et, auctor vulputate quam donec vitae
            consectetur turpis
          </p>
        </div>
        <div className="room-outer">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 team-slider">
            <CardDestination />
            <CardDestination />
            <CardDestination />
          </div>
        </div>
      </div>
    </section>
  );
}
