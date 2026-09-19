import CardRoom from "@/components/ui/CardRoom";

export default function DatPhong() {
  return (
    <section className="rooms rooms-style1">
      <div className="container">
        <div className="section-title">
          <h2>
            Explore <span>Rooms</span>
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex
            neque, sodales accumsan sapien et, auctor vulputate quam donec vitae
            consectetur turpis
          </p>
        </div>
        <div className="room-outer">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
            <CardRoom />
            <CardRoom />
            <CardRoom />
            <CardRoom />
            <CardRoom />
            <CardRoom />
          </div>
        </div>
      </div>
    </section>
  );
}
