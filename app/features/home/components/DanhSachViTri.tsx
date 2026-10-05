"use client";

import CardDestination from "@/components/ui/CardDestination";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { locationsThunks } from "@/features/locations/locations.thunks";
import {
  initializeHotuxTeamSlider,
  legacyScriptBundles,
  loadLegacyScripts,
} from "@/lib/legacy/scripts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function DanhSachViTri() {
  const dispatch = useAppDispatch();
  const { items, requests } = useAppSelector((state) => state.locations);
  const request = requests.list;

  useEffect(() => {
    const task = dispatch(locationsThunks.list());
    return () => task.abort();
  }, [dispatch]);

  useEffect(() => {
    if (request.status !== "succeeded" || items.length === 0) return;

    let cancelled = false;
    let cleanup: () => void = () => undefined;
    void loadLegacyScripts(legacyScriptBundles.hotuxHome)
      .then(() => {
        if (!cancelled) cleanup = initializeHotuxTeamSlider(document);
      })
      .catch((error: unknown) => {
        if (!cancelled)
          console.error("Hotux carousel scripts failed to load", error);
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [items, request.status]);

  return (
    <section className="rooms rooms-style2 rooms-style3 ds-section">
      <div className="container">
        <div className="section-title">
          <h2>
            Khám phá những <span>Điểm đến đầy thú vị</span>
          </h2>
          <p>Các địa điểm thu hút nhất Việt Nam</p>
        </div>
        <div className="room-outer">
          <div className="row team-slider" data-hotux-managed>
            {request.status === "idle" || request.status === "loading" ? (
              <div className="col-12 text-center py-5">
                <LoadingSpinner label="Đang tải danh sách điểm đến" />
              </div>
            ) : request.status === "failed" ? (
              <div className="col-12">
                <EmptyState
                  title="Không thể tải điểm đến"
                  description={request.error?.message}
                  action={
                    <button
                      type="button"
                      className="btn btn-orange"
                      onClick={() => {
                        void dispatch(locationsThunks.list());
                      }}
                    >
                      Thử lại
                    </button>
                  }
                />
              </div>
            ) : items.length > 0 ? (
              items.map((location) => (
                <div className="col-md-3" key={location.id}>
                  <CardDestination location={location} />
                </div>
              ))
            ) : (
              <div className="col-12">
                <EmptyState
                  title="Chưa có điểm đến"
                  description="Danh sách vị trí hiện chưa có dữ liệu."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
