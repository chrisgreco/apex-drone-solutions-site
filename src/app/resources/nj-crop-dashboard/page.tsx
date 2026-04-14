import { redirect, permanentRedirect } from "next/navigation";

/**
 * The old NJ Crop Dashboard route — merged into /resources as the primary hub.
 * 308 permanent redirect so Google consolidates SEO signal onto /resources.
 */
export default function NjCropDashboardRedirect() {
  permanentRedirect("/resources");
  // `permanentRedirect` throws, so this is unreachable — but satisfies the type
  // checker for the return path.
  redirect("/resources");
}
