import assert from "node:assert/strict";
import test from "node:test";
import {
  initialLocationFormValues,
  locationFormSchema,
  toCreateLocation,
  toLocationFormValues,
  toUpdateLocation,
} from "../app/features/locations/location-form";
import { validate } from "../app/lib/validation/rules";

test("location form validates the required API fields and supported image URL", () => {
  const missing = validate(initialLocationFormValues, locationFormSchema);
  assert.ok(missing.tenViTri);
  assert.ok(missing.tinhThanh);
  assert.ok(missing.hinhAnh);
  assert.equal(missing.quocGia, undefined);

  const invalidImage = validate(
    { ...initialLocationFormValues, hinhAnh: "https://example.com/place.jpg" },
    locationFormSchema,
  );
  assert.ok(invalidImage.hinhAnh);
});

test("location form trims controlled values for the POST payload", () => {
  const values = {
    tenViTri: "  Cái Răng  ",
    tinhThanh: "  Cần Thơ  ",
    quocGia: "  Việt Nam  ",
    hinhAnh: "https://airbnbnew.cybersoft.edu.vn/images/vt2.jpg",
  };

  assert.deepEqual(validate(values, locationFormSchema), {});
  assert.deepEqual(toCreateLocation(values), {
    tenViTri: "Cái Răng",
    tinhThanh: "Cần Thơ",
    quocGia: "Việt Nam",
    hinhAnh: "https://airbnbnew.cybersoft.edu.vn/images/vt2.jpg",
  });
});

test("location form fills existing data and sends the complete PUT payload with its id", () => {
  const location = {
    id: 202,
    tenViTri: "Cái Răng",
    tinhThanh: "Cần Thơ",
    quocGia: "Việt Nam",
    hinhAnh: "https://airbnbnew.cybersoft.edu.vn/images/vt2.jpg",
  };

  const values = toLocationFormValues(location);
  assert.equal(values.tenViTri, location.tenViTri);
  assert.deepEqual(toUpdateLocation(location.id, values), location);
});
