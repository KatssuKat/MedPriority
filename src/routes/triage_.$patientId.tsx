import { createFileRoute } from "@tanstack/react-router";
import { Triage } from "./triage";

export const Route = createFileRoute("/triage_/$patientId")({
  component: PatientTriage,
});

function PatientTriage() {
  const { patientId } = Route.useParams();
  return <Triage patientId={patientId} />;
}
