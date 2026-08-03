import { createFileRoute } from "@tanstack/react-router";
import { Kiosk } from "@/components/Kiosk";

export const Route = createFileRoute("/kiosk")({
  component: Kiosk,
});
