"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { Icon } from "@/components/admin";
import { routes } from "@/config/routes";

type Slider = {
  id: string;
  startDate: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
};

const staticSliders: Slider[] = [
  { id: "travel", startDate: "2022/04/25", image: "news1.jpg", title: "Make Your Trip Fun & Noted", subtitle: "Road To Travel", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
  { id: "travel", startDate: "2022/04/25", image: "news1.jpg", title: "Make Your Trip Fun & Noted", subtitle: "Road To Travel", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
  { id: "travel", startDate: "2022/04/25", image: "news1.jpg", title: "Make Your Trip Fun & Noted", subtitle: "Road To Travel", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
  { id: "travel", startDate: "2022/04/25", image: "news1.jpg", title: "Make Your Trip Fun & Noted", subtitle: "Road To Travel", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
  { id: "travel", startDate: "2022/04/25", image: "news1.jpg", title: "Make Your Trip Fun & Noted", subtitle: "Road To Travel", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
];

function preventNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function SliderModal({ id, title, slider, open, onClose, children }: { id: string; title: string; slider?: Slider; open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  if (!open) return null;
  return <>
    <div className="modal fade show" id={id} tabIndex={-1} aria-labelledby={id} aria-hidden="false" role="dialog" style={{ display: "block" }} onClick={onClose}>
      <div className="modal-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="modal-content">
          {title && <div className="modal-header text-center"><h5 className="modal-title" id="exampleModalLabel">{title}</h5></div>}
          <div className="modal-body">{slider ? <>
            <div className="sliderimages mb-3"><Image src={`/assets/images/${slider.image}`} alt="sliderimages" width={900} height={480} /></div>
            <h5 className="mb-1">{slider.subtitle}</h5>
            <h2 className="mb-1">{slider.title}</h2>
            <p className="mb-0">{slider.description}</p>
          </> : children}</div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show" onClick={onClose} />
  </>;
}

export function SliderManagementPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [modal, setModal] = useState<"add" | "view" | null>(null);
  const [selectedSlider, setSelectedSlider] = useState<Slider | undefined>();
  const filteredSliders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return staticSliders;
    return staticSliders.filter((slider) => [slider.id, slider.title, slider.subtitle].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [query]);

  const openView = (slider: Slider) => { setSelectedSlider(slider); setModal("view"); };
  const openAdd = () => { setSelectedSlider(undefined); setModal("add"); };
  const closeModal = () => setModal(null);
  const submitSlider = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); closeModal(); };

  return <>
    <nav className="page-breadcrumb d-flex align-items-center justify-content-between">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item"><Link href={routes.admin.dashboard}>Dashboard</Link></li>
        <li className="breadcrumb-item active" aria-current="page">Slider</li>
      </ol>
      <button className="btn btn-primary btn-icon-text" type="button" onClick={openAdd}>
        <Icon className="btn-icon-prepend" name="plus" /> Add Slider
      </button>
    </nav>

    <div className="search-box p-4 bg-white rounded mb-3 box-shadow">
      <form className="forms-sample" onSubmit={(event) => event.preventDefault()}>
        <div className="row align-items-center">
          <div className="col-lg-3"><h5>Slider Lists</h5></div>
          <div className="col-lg-6 col-md-4"><input type="text" placeholder="Search by slider title" className="form-control" value={query} onChange={(event) => { setQuery(event.target.value); setActivePage(1); }} /></div>
          <div className="col-lg-3 col-md-4">
            <select className="form-select form-select-lg" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Category</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option>
            </select>
          </div>
        </div>
      </form>
    </div>

    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card"><div className="card-body"><div className="table-responsive">
          <table id="dataTableExample" className="table">
            <thead><tr><th>ID</th><th>Start date</th><th>Image</th><th>Title</th><th>Subtitle</th><th className="text-center">Published</th><th className="text-center">Action</th></tr></thead>
            <tbody>{filteredSliders.map((slider, index) => <tr key={`${slider.id}-${index}`}>
              <td>{slider.id}</td><td>{slider.startDate}</td><td className="w-25"><Image src={`/assets/images/${slider.image}`} alt="image" width={900} height={480} /></td><td>{slider.title}</td><td>{slider.subtitle}</td>
              <td className="text-center"><span className="form-check form-switch"><input type="checkbox" className="form-check-input" id={`formSwitch${index + 1}`} /></span></td>
              <td className="text-center"><ul className="d-flex list-unstyled mb-0 justify-content-center">
                <li className="me-2"><a href="#viewslider" aria-label={`View ${slider.title}`} onClick={(event) => { preventNavigation(event); openView(slider); }}><Icon className="link-icon" name="eye" /></a></li>
                <li className="me-2"><a href="#addslider" aria-label={`Edit ${slider.title}`} onClick={(event) => { preventNavigation(event); openAdd(); }}><Icon className="link-icon" name="edit" /></a></li>
                <li><a href="#delete-slider" aria-label={`Delete ${slider.title}`} onClick={preventNavigation}><Icon className="link-icon" name="trash" /></a></li>
              </ul></td>
            </tr>)}</tbody>
          </table>
        </div></div></div>
      </div>
    </div>

    <div className="row"><div className="dataTables_paginate"><ul className="pagination">
      <li className={`paginate_button page-item ${activePage === 1 ? "disabled" : ""}`}><a href="#previous" className="page-link" onClick={(event) => { event.preventDefault(); setActivePage((page) => Math.max(1, page - 1)); }}>Previous</a></li>
      {[1, 2, 3].map((page) => <li className={`paginate_button page-item ${activePage === page ? "active" : ""}`} key={page}><a href={`#page-${page}`} className="page-link" onClick={(event) => { event.preventDefault(); setActivePage(page); }}>{page}</a></li>)}
      <li className={`paginate_button page-item ${activePage === 3 ? "disabled" : ""}`}><a href="#next" className="page-link" onClick={(event) => { event.preventDefault(); setActivePage((page) => Math.min(3, page + 1)); }}>Next</a></li>
    </ul></div></div>

    <SliderModal id="viewslider" title="" slider={selectedSlider} open={modal === "view"} onClose={closeModal}>{null}</SliderModal>
    <SliderModal id="addslider" title="Add Slider" open={modal === "add"} onClose={closeModal}>
      <form className="forms-sample" onSubmit={submitSlider}>
        <div className="mb-3"><label htmlFor="subtitle" className="form-label"> Slider Sub Title</label><input type="text" className="form-control" id="subtitle" autoComplete="off" /></div>
        <div className="mb-3"><label htmlFor="title" className="form-label">Slider Title</label><input type="text" className="form-control" id="title" /></div>
        <div className="mb-3"><label htmlFor="password" className="form-label">Slider Description</label><input type="number" className="form-control" id="password" autoComplete="off" /></div>
        <div className="mb-3"><label htmlFor="upload" className="form-label">Upload Images</label><input className="form-control" type="file" id="upload" /></div>
        <div className="mb-3"><label htmlFor="slider-button" className="form-label">Slider Button</label><input type="text" className="form-control" id="slider-button" /></div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-icon-text">
            <Icon className="btn-icon-prepend" name="plus" /> Create Slider
          </button>
        </div>
      </form>
    </SliderModal>
  </>;
}
