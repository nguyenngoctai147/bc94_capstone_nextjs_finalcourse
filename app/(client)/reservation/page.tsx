import { redirect } from "next/navigation";
import { routes } from "@/route";

export default function Page() {
  redirect(routes.reservation.availability);
}
