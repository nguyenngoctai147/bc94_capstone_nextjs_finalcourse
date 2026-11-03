import assert from "node:assert/strict";
import test from "node:test";
import { initialRoomFormValues, roomFormSchema, toCreateRoom, toRoomFormValues, toUpdateRoom } from "../app/features/rooms/room-form";
import { validate } from "../app/lib/validation/rules";

test("room form validates required API fields and image URLs", () => {
  const missing = validate({ ...initialRoomFormValues, khach: "0", hinhAnh: "invalid" }, roomFormSchema);
  assert.ok(missing.tenPhong);
  assert.ok(missing.khach);
  assert.ok(missing.moTa);
  assert.ok(missing.giaTien);
  assert.ok(missing.maViTri);
  assert.ok(missing.hinhAnh);
  assert.ok(validate({ ...initialRoomFormValues, hinhAnh: "https://example.com/room.jpg" }, roomFormSchema).hinhAnh);
});

test("room form converts controlled string values to the POST room payload", () => {
  const values = {
    ...initialRoomFormValues,
    tenPhong: "  Deluxe hướng biển  ",
    khach: "4",
    phongNgu: "2",
    giuong: "2",
    phongTam: "1",
    moTa: "  Phòng nhìn ra biển.  ",
    giaTien: "120",
    maViTri: "3",
    hinhAnh: "https://airbnbnew.cybersoft.edu.vn/images/room.jpg",
    wifi: "true",
    dieuHoa: "true",
  };

  assert.deepEqual(validate(values, roomFormSchema), {});
  assert.deepEqual(toCreateRoom(values), {
    tenPhong: "Deluxe hướng biển",
    khach: 4,
    phongNgu: 2,
    giuong: 2,
    phongTam: 1,
    moTa: "Phòng nhìn ra biển.",
    giaTien: 120,
    maViTri: 3,
    hinhAnh: "https://airbnbnew.cybersoft.edu.vn/images/room.jpg",
    wifi: true,
    dieuHoa: true,
    bep: false,
    mayGiat: false,
    tivi: false,
    doXe: false,
    hoBoi: false,
    banLa: false,
    banUi: false,
  });
});

test("room form fills existing data and sends the complete PUT payload with its id", () => {
  const room = {
    id: 73,
    tenPhong: "Deluxe hướng biển",
    khach: 4,
    phongNgu: 2,
    giuong: 2,
    phongTam: 1,
    moTa: "Phòng nhìn ra biển.",
    giaTien: 120,
    maViTri: 3,
    hinhAnh: "https://airbnbnew.cybersoft.edu.vn/images/room.jpg",
    wifi: true,
    dieuHoa: true,
    bep: false,
    mayGiat: false,
    tivi: false,
    doXe: false,
    hoBoi: false,
    banLa: false,
    banUi: false,
  };
  const values = toRoomFormValues(room);
  assert.equal(values.tenPhong, room.tenPhong);
  assert.equal(values.giaTien, "120");
  assert.equal(values.wifi, "true");
  assert.deepEqual(toUpdateRoom(room.id, values), room);
});
