import Blog from "@/features/home/components/Blog";
import DanhSachPhong from "@/features/home/components/DanhSachViTri";
import DatPhong from "@/features/home/components/DatPhong";
import GalleryH from "@/features/home/components/GalleryH";
import { HomeBanner } from "@/features/home/components/HomeBanner";
import ThongKeKhach from "@/features/home/components/ThongKeKhach";
import { VeChungToi } from "@/features/home/components/VeChungToi";

export default function Page() {
  return (
    <>
      <HomeBanner />
      <VeChungToi />
      <DanhSachPhong />
      <DatPhong />
      <ThongKeKhach />
      <Blog />
      <GalleryH />
    </>
  );
}
