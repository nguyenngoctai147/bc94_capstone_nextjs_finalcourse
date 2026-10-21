"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchRooms } from "@/features/rooms/rooms.slice";
import { fetchLocations } from "@/features/locations/locations.slice";
import { fetchReviews } from "@/features/reviews/reviews.slice";
import DanhSachViTri from "./DanhSachViTri";
import DatPhong from "./DatPhong";
import GalleryH from "./GalleryH";
import { HomeBanner } from "./HomeBanner";

export function HomePage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const roomsTask = dispatch(fetchRooms());
    const locationsTask = dispatch(fetchLocations());
    const reviewsTask = dispatch(fetchReviews());
    return () => {
      roomsTask.abort();
      locationsTask.abort();
      reviewsTask.abort();
    };
  }, [dispatch]);
  return <><HomeBanner /><DanhSachViTri /><DatPhong /><GalleryH /></>;
}
