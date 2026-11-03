"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPageHeader, Icon } from "@/components/admin";
import { Alert, Button, Input, LoadingSpinner } from "@/components/ui";
import { routes } from "@/config/routes";
import { useForm } from "@/hooks/useForm";
import { toApiError } from "@/lib/api/errors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  initialLocationFormValues,
  locationFormSchema,
  toCreateLocation,
  toLocationFormValues,
  toUpdateLocation,
} from "../location-form";
import {
  createLocation,
  fetchLocationDetail,
  updateLocation,
} from "../locations.slice";

export function CreateLocationPage() {
  return <LocationEditorPage />;
}

export function EditLocationPage({ locationId }: { locationId: number }) {
  return <LocationEditorPage locationId={locationId} />;
}

function LocationEditorPage({ locationId }: { locationId?: number }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useForm(initialLocationFormValues, locationFormSchema);
  const locations = useAppSelector((state) => state.locations);
  const isEditing = locationId !== undefined;
  const currentLocation = locations.selected?.id === locationId
    ? locations.selected
    : null;
  const [submitError, setSubmitError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const resetLocationForm = form.resetTo;

  useEffect(() => {
    if (!isEditing || locationId === undefined) return;

    const task = dispatch(fetchLocationDetail(locationId));
    return () => task.abort();
  }, [dispatch, isEditing, loadAttempt, locationId]);

  useEffect(() => {
    if (
      !isEditing ||
      !currentLocation ||
      locations.requests.detail.status !== "succeeded"
    ) {
      return;
    }

    resetLocationForm(toLocationFormValues(currentLocation));
  }, [
    currentLocation,
    isEditing,
    locations.requests.detail.status,
    resetLocationForm,
  ]);

  const handleSaveLocation = form.handleSubmit(async (values) => {
    setSubmitError("");

    try {
      if (isEditing && locationId !== undefined) {
        await dispatch(
          updateLocation({
            id: locationId,
            data: toUpdateLocation(locationId, values),
          }),
        ).unwrap();
      } else {
        await dispatch(createLocation(toCreateLocation(values))).unwrap();
      }
      router.push(routes.admin.locations);
    } catch (error) {
      setSubmitError(toApiError(error).message);
    }
  });

  const handleReset = () => {
    if (currentLocation) {
      resetLocationForm(toLocationFormValues(currentLocation));
    } else {
      form.reset();
    }
    setSubmitError("");
  };

  const detailRequest = locations.requests.detail;
  const loadingLocation =
    isEditing &&
    (detailRequest.status === "idle" || detailRequest.status === "loading");
  const title = isEditing ? "Sửa vị trí" : "Thêm vị trí";
  const description = isEditing
    ? "Cập nhật tên, khu vực và hình ảnh của điểm đến theo API vị trí."
    : "Tạo điểm đến mới để phân nhóm phòng và hỗ trợ khách tìm kiếm chỗ nghỉ.";

  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Tổng quan", href: routes.admin.dashboard },
          { label: "Vị trí", href: routes.admin.locations },
          { label: title },
        ]}
        action={
          <Link href={routes.admin.locations} className="btn btn-outline-primary">
            <Icon className="me-1" name="arrow-left" size={18} />
            Quay lại danh sách
          </Link>
        }
      />

      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card w-100">
            <div className="card-body">
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              {isEditing && detailRequest.status === "failed" && (
                <Alert variant="danger">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <span>
                      {detailRequest.error?.message ??
                        "Không thể tải thông tin vị trí."}
                    </span>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                    >
                      Tải lại
                    </Button>
                  </div>
                </Alert>
              )}

              {loadingLocation ? (
                <div className="py-4">
                  <LoadingSpinner label="Đang tải thông tin vị trí" />
                </div>
              ) : detailRequest.status !== "failed" || !isEditing ? (
                <form
                  className="forms-sample"
                  noValidate
                  onSubmit={handleSaveLocation}
                >
                <section className="mb-4" aria-labelledby="location-basic-heading">
                  <h2 id="location-basic-heading" className="h5 mb-3">
                    Thông tin vị trí
                  </h2>
                  <div className="row g-3">
                    <div className="col-lg-6">
                      <Input
                        label="Tên vị trí"
                        name="tenViTri"
                        required
                        placeholder="Ví dụ: Cái Răng"
                        autoComplete="off"
                        value={form.values.tenViTri}
                        error={form.errors.tenViTri}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Input
                        label="Tỉnh / thành phố"
                        name="tinhThanh"
                        required
                        placeholder="Ví dụ: Cần Thơ"
                        autoComplete="address-level1"
                        value={form.values.tinhThanh}
                        error={form.errors.tinhThanh}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Input
                        label="Quốc gia"
                        name="quocGia"
                        required
                        placeholder="Ví dụ: Việt Nam"
                        autoComplete="country-name"
                        value={form.values.quocGia}
                        error={form.errors.quocGia}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Input
                        label="URL hình ảnh"
                        name="hinhAnh"
                        type="url"
                        required
                        placeholder="https://airbnbnew.cybersoft.edu.vn/images/..."
                        hint="Dùng URL ảnh HTTPS thuộc nguồn hình ảnh đã được website hỗ trợ."
                        autoComplete="url"
                        value={form.values.hinhAnh}
                        error={form.errors.hinhAnh}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                    </div>
                  </div>
                </section>

                <div className="d-flex flex-wrap gap-2 border-top pt-4">
                  <Button type="submit" loading={form.submitting}>
                    {isEditing ? "Cập nhật vị trí" : "Tạo vị trí"}
                  </Button>
                  <Button
                    type="reset"
                    variant="outline-secondary"
                    disabled={form.submitting}
                    onClick={handleReset}
                  >
                    {isEditing ? "Khôi phục dữ liệu" : "Làm lại"}
                  </Button>
                </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
