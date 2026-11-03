import { resolveApiImageSrc } from "@/lib/api/images";
import {
  httpUrl,
  required,
  type ValidationSchema,
} from "@/lib/validation/rules";
import type {
  CreateLocation,
  Location,
  UpdateLocation,
} from "./locations.types";

export type LocationFormValues = {
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
};

export const initialLocationFormValues: LocationFormValues = {
  tenViTri: "",
  tinhThanh: "",
  quocGia: "Việt Nam",
  hinhAnh: "",
};

export const locationFormSchema: ValidationSchema<LocationFormValues> = {
  tenViTri: [required("Vui lòng nhập tên vị trí.")],
  tinhThanh: [required("Vui lòng nhập tỉnh hoặc thành phố.")],
  quocGia: [required("Vui lòng nhập quốc gia.")],
  hinhAnh: [
    required("Vui lòng nhập URL hình ảnh."),
    httpUrl,
    (value) =>
      !value || resolveApiImageSrc(value)
        ? undefined
        : "URL ảnh chưa được cấu hình để hiển thị trong website.",
  ],
};

export const toCreateLocation = (
  values: LocationFormValues,
): CreateLocation => ({
  tenViTri: values.tenViTri.trim(),
  tinhThanh: values.tinhThanh.trim(),
  quocGia: values.quocGia.trim(),
  hinhAnh: values.hinhAnh.trim(),
});

export const toLocationFormValues = (
  location: Location,
): LocationFormValues => ({
  tenViTri: location.tenViTri,
  tinhThanh: location.tinhThanh,
  quocGia: location.quocGia,
  hinhAnh: location.hinhAnh,
});

export const toUpdateLocation = (
  id: number,
  values: LocationFormValues,
): UpdateLocation => ({ id, ...toCreateLocation(values) });
