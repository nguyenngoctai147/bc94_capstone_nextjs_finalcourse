import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import CardRoom from "../app/components/ui/CardRoom";
import { ResourcePanel } from "../app/components/admin/ResourcePanel";
import { Pagination } from "../app/components/ui/Pagination";
import { MyBookings } from "../app/features/bookings/components/MyBookings";
import { hydrateSession } from "../app/features/auth/auth.slice";
import { makeStore } from "../app/store";
import { fetchBookings } from "../app/features/bookings/bookings.slice";
import type { Room } from "../app/features/rooms/rooms.types";

const room: Room = {
  id: 73, tenPhong: "Phòng bên biển", khach: 4, phongNgu: 2, giuong: 2, phongTam: 1,
  moTa: "Ban công hướng biển", giaTien: 28, maViTri: 8, hinhAnh: "",
  mayGiat: false, banLa: false, banUi: false, tivi: false, dieuHoa: false,
  wifi: false, bep: false, doXe: false, hoBoi: false,
};

test("both room card layouts use the real room and keep dates through detail and booking links", () => {
  for (const variant of ["grid", "list"] as const) {
    const markup = renderToStaticMarkup(createElement(CardRoom, { room, variant,
      search: { checkIn: "2030-10-20", checkOut: "2030-10-23", guests: 3, locationId: 8 },
    }));
    assert.match(markup, /Phòng bên biển/);
    assert.match(markup, /\$28/);
    assert.match(markup, /Chưa có ảnh phòng/);
    assert.match(markup, /href="\/rooms\/73\?checkIn=2030-10-20&amp;checkOut=2030-10-23&amp;guests=3&amp;maViTri=8"/);
    assert.match(markup, /href="\/reservation\/availability\?maPhong=73&amp;checkIn=2030-10-20&amp;checkOut=2030-10-23&amp;guests=3&amp;maViTri=8"/);
    assert.doesNotMatch(markup, /Wi-Fi|Điều hòa|Lorem|fa fa-star checked/);
    assert.match(markup, /Chưa có đánh giá/);
    assert.equal((markup.match(/fa fa-star/g) ?? []).length, 5);
    assert.doesNotMatch(markup, /Ban công hướng biển/);
    assert.match(markup, /room-services mar-bottom-15/);
    assert.match(markup, variant === "grid" ? /room-btns mar-top-20/ : /grid-btn mar-top-20/);
  }
});

test("room card follows the static rating structure when rating data is provided", () => {
  const markup = renderToStaticMarkup(createElement(CardRoom, { room, rating: 4 }));
  assert.match(markup, /class="room-item [^"]*"/);
  assert.match(markup, /class="room-image [^"]*"/);
  assert.match(markup, /class="room-content [^"]*"/);
  assert.match(markup, /class="room-title [^"]*"/);
  assert.match(markup, /class="deal-rating"/);
  assert.match(markup, /Đánh giá 4 trên 5/);
  assert.equal((markup.match(/fa fa-star checked/g) ?? []).length, 4);
  assert.equal((markup.match(/fa fa-star/g) ?? []).length, 5);
});

test("admin booking list renders backend records, empty results and failures without sample rows", () => {
  const store = makeStore();
  const render = () => renderToStaticMarkup(createElement(Provider, { store } as Parameters<typeof Provider>[0], createElement(ResourcePanel, { resource: "bookings" })));
  assert.match(render(), /Đang tải danh sách/);
  store.dispatch(fetchBookings.pending("request-1", undefined));
  store.dispatch(fetchBookings.fulfilled({ data: [{ id: 901, maPhong: 73, maNguoiDung: 12,
    ngayDen: "2030-10-20T00:00:00", ngayDi: "2030-10-23T00:00:00", soLuongKhach: 3,
  }], totalRow: 1, pageIndex: 1, pageSize: 10 }, "request-1", undefined));
  const loaded = render();
  assert.match(loaded, /901/);
  assert.match(loaded, /Phòng #73 · Khách #12/);
  assert.match(loaded, /2030-10-20 → 2030-10-23/);
  assert.match(loaded, /Số khách/);
  assert.doesNotMatch(loaded, /Suroj|Pending|Verified/);

  store.dispatch(fetchBookings.pending("request-2", undefined));
  store.dispatch(fetchBookings.fulfilled({ data: [], totalRow: 0, pageIndex: 1, pageSize: 10 }, "request-2", undefined));
  assert.match(render(), /Danh sách hiện chưa có dữ liệu/);

  store.dispatch(fetchBookings.pending("request-3", undefined));
  store.dispatch(fetchBookings.rejected(null, "request-3", undefined, { status: 503, message: "Backend tạm dừng" }));
  assert.match(render(), /Backend tạm dừng/);
  assert.doesNotMatch(render(), /Phòng #73/);
});

test("pagination clamps shrinking result sets and never submits its surrounding form", () => {
  const markup = renderToStaticMarkup(createElement(Pagination, { page: 8, pageSize: 5, total: 2, onChange: () => undefined }));
  assert.match(markup, /Trang 1 \/ 1/);
  assert.equal((markup.match(/type="button"/g) ?? []).length, 2);
  assert.equal((markup.match(/disabled=""/g) ?? []).length, 2);
});

test("MyBookings does not show another user's records cached by the admin list", () => {
  const store = makeStore();
  store.dispatch(hydrateSession({ token: "fixture-token", user: {
    id: 12, name: "Khách kiểm thử", email: "fixture@example.test", phone: null, birthday: "", gender: false, role: "USER",
  } }));
  store.dispatch(fetchBookings.pending("cached", undefined));
  store.dispatch(fetchBookings.fulfilled({ data: [12, 99].map((maNguoiDung) => ({
    id: maNguoiDung, maPhong: 73, maNguoiDung, ngayDen: "2030-10-20", ngayDi: "2030-10-23", soLuongKhach: 3,
  })), totalRow: 2, pageIndex: 1, pageSize: 10 }, "cached", undefined));
  const markup = renderToStaticMarkup(createElement(Provider, { store } as Parameters<typeof Provider>[0], createElement(MyBookings)));
  assert.match(markup, /Đặt phòng #12/);
  assert.doesNotMatch(markup, /Đặt phòng #99/);
});
