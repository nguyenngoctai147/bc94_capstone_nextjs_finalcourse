import DanhSachViTri from "@/features/home/components/DanhSachViTri";
import DatPhong from "@/features/home/components/DatPhong";
import GalleryH from "@/features/home/components/GalleryH";
import { HomeBanner } from "@/features/home/components/HomeBanner";

export default function Page() {
  return (
    <>
      <HomeBanner />
      <DanhSachViTri />
      <DatPhong />
      <GalleryH />
    </>
  );
}
