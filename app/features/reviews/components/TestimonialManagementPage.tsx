"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Icon } from "@/components/admin";
import { routes } from "@/config/routes";

type Testimonial = {
  id: string;
  startDate: string;
  image: string;
  name: string;
  post: string;
  description: string;
  rating: number;
  published: boolean;
};

type TestimonialForm = Pick<
  Testimonial,
  "name" | "post" | "description" | "rating"
>;

const testimonialDescription =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.";

const staticTestimonials: Testimonial[] = Array.from({ length: 5 }, (_, index) => ({
  id: `travel-${index + 1}`,
  startDate: "2022/04/25",
  image: "news2.jpg",
  name: "Ling Cod",
  post: "CEO at Bakery",
  description: testimonialDescription,
  rating: 4,
  published: true,
}));

const emptyForm: TestimonialForm = {
  name: "",
  post: "",
  description: "",
  rating: 4,
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Icon
          className={index < rating ? "link-icon rating-color" : "link-icon rating-color1"}
          key={index}
          name="star"
        />
      ))}
    </span>
  );
}

export function TestimonialManagementPage() {
  const [testimonials, setTestimonials] = useState(staticTestimonials);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState("");
  const [category, setCategory] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [modal, setModal] = useState<"form" | "view" | null>(null);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [selectedImage, setSelectedImage] = useState("");

  const filteredTestimonials = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return testimonials.filter((testimonial) => {
      const matchesQuery = !normalizedQuery || [testimonial.name, testimonial.post, testimonial.description]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesCategory = !category || category === "1";
      return matchesQuery && matchesCategory;
    });
  }, [category, query, testimonials]);

  useEffect(() => {
    if (!modal) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [modal]);

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setSelectedImage("");
  };

  const openAdd = () => {
    setSelected(null);
    setSelectedImage("");
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (testimonial: Testimonial) => {
    setSelected(testimonial);
    setSelectedImage("");
    setForm({
      name: testimonial.name,
      post: testimonial.post,
      description: testimonial.description,
      rating: testimonial.rating,
    });
    setModal("form");
  };

  const updateForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateRating = (rating: number) => {
    setForm((current) => ({ ...current, rating }));
  };

  const saveTestimonial = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selected) {
      setTestimonials((current) =>
        current.map((testimonial) =>
          testimonial.id === selected.id
            ? { ...testimonial, ...form }
            : testimonial,
        ),
      );
    } else {
      setTestimonials((current) => [
        {
          id: `travel-${Date.now()}`,
          startDate: "2022/04/25",
          image: "news2.jpg",
          ...form,
          published: true,
        },
        ...current,
      ]);
    }
    closeModal();
  };

  const togglePublished = (id: string) => {
    setTestimonials((current) =>
      current.map((testimonial) =>
        testimonial.id === id
          ? { ...testimonial, published: !testimonial.published }
          : testimonial,
      ),
    );
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((current) => current.filter((testimonial) => testimonial.id !== id));
  };

  return (
    <>
      <nav className="page-breadcrumb d-flex align-items-center justify-content-between">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><Link href={routes.admin.dashboard}>Dashboard</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Testimonials</li>
        </ol>
        <button className="btn btn-primary" type="button" onClick={openAdd}>
          <Icon className="link-icon" name="plus" /> Add Testimonials
        </button>
      </nav>

      <div className="search-box p-4 bg-white rounded mb-3 box-shadow">
        <form className="forms-sample" onSubmit={(event) => event.preventDefault()}>
          <div className="row align-items-center">
            <div className="col-lg-3"><h5>Testimonials Lists</h5></div>
            <div className="col-lg-4 col-md-4">
              <input type="text" placeholder="Search by slider title" className="form-control" value={query} onChange={(event) => { setQuery(event.target.value); setActivePage(1); }} />
            </div>
            <div className="col-lg-2 col-md-4">
              <select className="form-select form-select-lg" value={entries} onChange={(event) => setEntries(event.target.value)}>
                <option value="">Show Entries</option><option value="10">10</option><option value="20">20</option><option value="30">30</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-4">
              <select className="form-select form-select-lg" value={category} onChange={(event) => { setCategory(event.target.value); setActivePage(1); }}>
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
              <thead><tr><th>ID</th><th>Start date</th><th>Image</th><th>Name</th><th>Post</th><th>Description</th><th>Rating</th><th className="text-center">Published</th><th className="text-center">Action</th></tr></thead>
              <tbody>{filteredTestimonials.map((testimonial) => <tr key={testimonial.id}>
                <td>travel</td><td>{testimonial.startDate}</td>
                <td className="w-25"><Image src={`/assets/images/${testimonial.image}`} alt="image" className="w-100" width={900} height={480} style={{ height: "auto" }} /></td>
                <td>{testimonial.name}</td><td>{testimonial.post}</td><td>{testimonial.description}</td><td><RatingStars rating={testimonial.rating} /></td>
                <td className="text-center"><span className="form-check form-switch"><input type="checkbox" className="form-check-input" id={`formSwitch${testimonial.id}`} checked={testimonial.published} onChange={() => togglePublished(testimonial.id)} /></span></td>
                <td><ul className="d-flex list-unstyled mb-0 justify-content-center">
                  <li className="me-2"><button className="p-0 border-0 bg-transparent" type="button" aria-label={`View ${testimonial.name}`} onClick={() => { setSelected(testimonial); setModal("view"); }}><Icon className="link-icon" name="eye" /></button></li>
                  <li className="me-2"><button className="p-0 border-0 bg-transparent" type="button" aria-label={`Edit ${testimonial.name}`} onClick={() => openEdit(testimonial)}><Icon className="link-icon" name="edit" /></button></li>
                  <li><button className="p-0 border-0 bg-transparent" type="button" aria-label={`Delete ${testimonial.name}`} onClick={() => deleteTestimonial(testimonial.id)}><Icon className="link-icon" name="trash" /></button></li>
                </ul></td>
              </tr>)}</tbody>
            </table>
          </div></div></div>
        </div>
      </div>

      <div className="row"><div className="dataTables_paginate"><ul className="pagination">
        <li className={`paginate_button page-item ${activePage === 1 ? "disabled" : ""}`}><button className="page-link" type="button" onClick={() => setActivePage((page) => Math.max(1, page - 1))}>Previous</button></li>
        {[1, 2, 3].map((page) => <li className={`paginate_button page-item ${activePage === page ? "active" : ""}`} key={page}><button className="page-link" type="button" onClick={() => setActivePage(page)}>{page}</button></li>)}
        <li className={`paginate_button page-item ${activePage === 3 ? "disabled" : ""}`}><button className="page-link" type="button" onClick={() => setActivePage((page) => Math.min(3, page + 1))}>Next</button></li>
      </ul></div></div>

      {modal === "view" && selected && <>
        <div className="modal fade show" id="viewtestimonial" tabIndex={-1} aria-labelledby="viewtestimonial" aria-hidden="false" role="dialog" style={{ display: "block" }} onClick={closeModal}>
          <div className="modal-dialog" onClick={(event) => event.stopPropagation()}><div className="modal-content"><div className="modal-header text-center"><h5 className="modal-title">Testimonial Details</h5></div><div className="modal-body">
            <div className="mb-3"><Image src={`/assets/images/${selected.image}`} alt={selected.name} className="w-100" width={900} height={480} style={{ height: "auto" }} /></div>
            <h5>{selected.name}</h5><p className="text-muted">{selected.post}</p><p>{selected.description}</p><RatingStars rating={selected.rating} />
          </div></div></div>
        </div><div className="modal-backdrop fade show" onClick={closeModal} />
      </>}

      {modal === "form" && <>
        <div className="modal fade show" id="addslider" tabIndex={-1} aria-labelledby="addslider" aria-hidden="false" role="dialog" style={{ display: "block" }} onClick={closeModal}>
          <div className="modal-dialog" onClick={(event) => event.stopPropagation()}><div className="modal-content"><div className="modal-header text-center"><h5 className="modal-title">{selected ? "Edit Testimonials" : "Add Testimonials"}</h5></div><div className="modal-body">
            <form className="forms-sample" onSubmit={saveTestimonial}>
              <div className="mb-3"><label htmlFor="testimonial-upload" className="form-label">Upload Images</label><input className="form-control" type="file" id="testimonial-upload" accept="image/*" onChange={(event) => setSelectedImage(event.target.files?.[0]?.name ?? "")} />{selectedImage && <p className="tx-12 text-muted mt-2 mb-0">Selected: {selectedImage}</p>}</div>
              <div className="mb-3"><label htmlFor="testimonial-name" className="form-label">Name</label><input type="text" className="form-control" id="testimonial-name" name="name" autoComplete="off" value={form.name} onChange={updateForm} required /></div>
              <div className="mb-3"><label htmlFor="testimonial-post" className="form-label">Post</label><input type="text" className="form-control" id="testimonial-post" name="post" value={form.post} onChange={updateForm} required /></div>
              <div className="mb-3"><label htmlFor="testimonial-description" className="form-label">Description</label><input type="text" className="form-control" id="testimonial-description" name="description" value={form.description} onChange={updateForm} required /></div>
              <fieldset className="mb-3"><legend className="form-label">Rating</legend><div>{[1, 2, 3, 4, 5].map((rating) => <div className="form-check form-check-inline" key={rating}><input type="radio" name="rating" className="form-check-input" id={`rating-${rating}`} checked={form.rating === rating} onChange={() => updateRating(rating)} /><label className="form-check-label" htmlFor={`rating-${rating}`}>{rating}</label></div>)}</div></fieldset>
              <div className="text-center"><button type="submit" className="btn btn-primary"><Icon className="link-icon" name="plus" /> {selected ? "Update Testimonials" : "Create Testimonials"}</button></div>
            </form>
          </div></div></div>
        </div><div className="modal-backdrop fade show" onClick={closeModal} />
      </>}
    </>
  );
}
